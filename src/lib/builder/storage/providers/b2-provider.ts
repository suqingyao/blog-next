import type { B2Config, ProgressCallback, StorageObject, StorageProvider, StorageUploadOptions } from '../interfaces.js';
import { Buffer } from 'node:buffer';
import crypto from 'node:crypto';

import path from 'node:path';
import { SUPPORTED_FORMATS } from '../../constants/index.js';
import { logger } from '../../logger/index.js';

const B2_AUTHORIZE_URL = 'https://api.backblazeb2.com/b2api/v3/b2_authorize_account';
const DEFAULT_AUTH_TTL_MS = 1000 * 60 * 60 * 23; // refresh slightly before the 24h expiry
const DEFAULT_UPLOAD_TTL_MS = 1000 * 60 * 30;
const MAX_PAGE_SIZE = 1000;

interface B2AuthorizeAccountResponse {
  authorizationToken: string;
  apiUrl?: string;
  downloadUrl?: string;
  s3ApiUrl?: string;
  allowed?: {
    bucketId: string | null;
    bucketName: string | null;
    namePrefix?: string | null;
  };
  apiInfo?: {
    storageApi?: {
      apiUrl?: string;
      downloadUrl?: string;
      s3ApiUrl?: string;
      bucketId?: string | null;
      bucketName?: string | null;
      namePrefix?: string | null;
      capabilities?: string[];
    };
  };
}

interface B2FileInfo {
  fileId: string;
  fileName: string;
  contentLength: number;
  contentSha1?: string;
  uploadTimestamp?: number;
}

interface B2ListFileNamesResponse {
  files?: B2FileInfo[];
  nextFileName?: string | null;
}

interface B2GetUploadUrlResponse {
  uploadUrl: string;
  authorizationToken: string;
}

interface B2CopyFileResponse extends B2FileInfo {
  bucketId: string;
  contentMd5?: string;
  contentType?: string;
  fileInfo?: Record<string, string>;
}

interface B2BucketResponse {
  bucketId: string;
  bucketName: string;
}

interface AuthorizationState {
  token: string;
  apiUrl: string;
  downloadUrl: string;
  allowedBucketId?: string | null;
  allowedBucketName?: string | null;
  expiresAt: number;
}

interface UploadAuthState {
  uploadUrl: string;
  token: string;
  expiresAt: number;
}

function sanitizePath(value?: string | null): string {
  if (!value)
    return '';
  return value.replaceAll('\\', '/').replaceAll(/\/+/g, '/').replace(/^\/+/, '').replace(/\/+$/, '');
}

function encodeFileName(value: string): string {
  return value
    .split('/')
    .map(segment => encodeURIComponent(segment))
    .join('/');
}

function formatB2Error(status: number, payload: string | null): string {
  if (!payload) {
    return `B2 API 请求失败 (status ${status})`;
  }

  try {
    const parsed = JSON.parse(payload) as { code?: string; message?: string };
    if (parsed && (parsed.code || parsed.message)) {
      const parts: string[] = [];
      if (parsed.code)
        parts.push(`[${parsed.code}]`);
      if (parsed.message)
        parts.push(parsed.message);
      return `B2 API 请求失败 (status ${status}) ${parts.join(' ')}`;
    }
  }
  catch {
    // ignore parse error
  }

  return `B2 API 请求失败 (status ${status}) ${payload}`;
}

export class B2StorageProvider implements StorageProvider {
  private readonly config: B2Config;
  private readonly prefix: string;
  private readonly excludeRegex: RegExp | null;
  private authorization: AuthorizationState | null = null;
  private uploadAuth: UploadAuthState | null = null;
  private bucketNameCache: string | null = null;

  constructor(config: B2Config) {
    if (!config.applicationKeyId || !config.applicationKey) {
      throw new Error('B2StorageProvider: applicationKeyId/applicationKey 不能为空');
    }
    if (!config.bucketId) {
      throw new Error('B2StorageProvider: bucketId 不能为空');
    }

    if (config.maxFileLimit !== undefined && config.maxFileLimit !== null && config.maxFileLimit <= 0) {
      throw new Error('B2StorageProvider: maxFileLimit 必须大于 0');
    }

    if (config.excludeRegex) {
      try {
        // eslint-disable-next-line no-new
        new RegExp(config.excludeRegex);
      }
      catch (error) {
        throw new Error(`B2StorageProvider: 无效的 excludeRegex：${error}`);
      }
    }

    this.config = config;
    this.prefix = sanitizePath(config.prefix);
    this.excludeRegex = config.excludeRegex ? new RegExp(config.excludeRegex) : null;
  }

  private get authorizationTtl(): number {
    return this.config.authorizationTtlMs ?? DEFAULT_AUTH_TTL_MS;
  }

  private get uploadUrlTtl(): number {
    return this.config.uploadUrlTtlMs ?? DEFAULT_UPLOAD_TTL_MS;
  }

  private async authorize(force = false): Promise<AuthorizationState> {
    if (!force && this.authorization && this.authorization.expiresAt > Date.now()) {
      return this.authorization;
    }

    const basicToken = Buffer.from(`${this.config.applicationKeyId}:${this.config.applicationKey}`).toString('base64');
    const response = await fetch(B2_AUTHORIZE_URL, {
      headers: {
        Authorization: `Basic ${basicToken}`,
      },
    });

    const text = await response.text();
    if (!response.ok) {
      throw new Error(formatB2Error(response.status, text));
    }

    const payload = (text ? (JSON.parse(text) as B2AuthorizeAccountResponse) : null) as B2AuthorizeAccountResponse;
    const storageApi = payload.apiInfo?.storageApi;
    const apiUrl = payload.apiUrl ?? storageApi?.apiUrl;
    const downloadUrl = payload.downloadUrl ?? storageApi?.downloadUrl;

    if (!apiUrl || !downloadUrl) {
      throw new Error('B2StorageProvider: 授权响应缺少 apiUrl/downloadUrl, 请检查凭证或 API 版本');
    }

    const state: AuthorizationState = {
      token: payload.authorizationToken,
      apiUrl,
      downloadUrl,
      allowedBucketId: payload.allowed?.bucketId ?? storageApi?.bucketId ?? null,
      allowedBucketName: payload.allowed?.bucketName ?? storageApi?.bucketName ?? null,
      expiresAt: Date.now() + this.authorizationTtl,
    };

    this.authorization = state;
    if (this.config.bucketName) {
      this.bucketNameCache = this.config.bucketName;
    }
    else if (state.allowedBucketName) {
      this.bucketNameCache = state.allowedBucketName;
    }
    this.uploadAuth = null; // auth token change invalidates existing upload URLs

    return state;
  }

  private async apiRequest<T>(endpoint: string, payload: Record<string, unknown>, attempt = 0): Promise<T> {
    const auth = await this.authorize(attempt > 0);
    const url = `${auth.apiUrl.replace(/\/+$/, '')}/b2api/v3/${endpoint}`;
    const body = JSON.stringify(this.cleanPayload(payload));

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': auth.token,
        'Content-Type': 'application/json',
      },
      body,
    });

    const text = await response.text();
    if (response.status === 401 && attempt === 0) {
      await this.authorize(true);
      return await this.apiRequest<T>(endpoint, payload, attempt + 1);
    }

    if (!response.ok) {
      throw new Error(formatB2Error(response.status, text));
    }

    return text ? (JSON.parse(text) as T) : ({} as T);
  }

  private cleanPayload(payload: Record<string, unknown>): Record<string, unknown> {
    return Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== undefined && value !== null));
  }

  private normalizeKey(key: string): string {
    return key.replaceAll('\\', '/').replaceAll(/\/+/g, '/').replace(/^\/+/, '');
  }

  private toRemoteKey(key: string): string {
    const normalized = this.normalizeKey(key);
    if (!this.prefix) {
      return normalized;
    }
    if (!normalized) {
      return this.prefix;
    }
    return `${this.prefix}/${normalized}`;
  }

  private fromRemoteKey(remoteKey: string): string | null {
    if (!this.prefix) {
      return remoteKey;
    }

    if (remoteKey === this.prefix) {
      return '';
    }

    const prefixWithSlash = `${this.prefix}/`;
    if (!remoteKey.startsWith(prefixWithSlash)) {
      return null;
    }

    return remoteKey.slice(prefixWithSlash.length);
  }

  private matchExcludes(key: string | null): boolean {
    if (!key)
      return false;
    if (!this.excludeRegex)
      return false;
    return this.excludeRegex.test(key);
  }

  private async getBucketName(): Promise<string> {
    if (this.bucketNameCache) {
      return this.bucketNameCache;
    }

    if (this.config.bucketName) {
      this.bucketNameCache = this.config.bucketName;
      return this.bucketNameCache;
    }

    const auth = await this.authorize();
    if (auth.allowedBucketId === this.config.bucketId && auth.allowedBucketName) {
      this.bucketNameCache = auth.allowedBucketName;
      return this.bucketNameCache;
    }

    const bucket = await this.apiRequest<B2BucketResponse>('b2_get_bucket', {
      bucketId: this.config.bucketId,
    });

    if (!bucket.bucketName) {
      throw new Error('B2StorageProvider: 无法解析 bucketName，请在配置中显式提供');
    }

    this.bucketNameCache = bucket.bucketName;
    return this.bucketNameCache;
  }

  private async getUploadAuth(force = false): Promise<UploadAuthState> {
    if (!force && this.uploadAuth && this.uploadAuth.expiresAt > Date.now()) {
      return this.uploadAuth;
    }

    const result = await this.apiRequest<B2GetUploadUrlResponse>('b2_get_upload_url', {
      bucketId: this.config.bucketId,
    });

    this.uploadAuth = {
      uploadUrl: result.uploadUrl,
      token: result.authorizationToken,
      expiresAt: Date.now() + this.uploadUrlTtl,
    };

    return this.uploadAuth;
  }

  private async fetchAllFiles(progressCallback?: ProgressCallback): Promise<StorageObject[]> {
    const objects: StorageObject[] = [];
    let nextFileName: string | undefined;
    const maxLimit = this.config.maxFileLimit ?? Number.MAX_SAFE_INTEGER;

    do {
      if (objects.length >= maxLimit) {
        break;
      }

      const pageSize = Math.max(1, Math.min(MAX_PAGE_SIZE, maxLimit - objects.length));
      const response = await this.apiRequest<B2ListFileNamesResponse>('b2_list_file_names', {
        bucketId: this.config.bucketId,
        startFileName: nextFileName,
        maxFileCount: pageSize,
        prefix: this.prefix || undefined,
      });

      const files = response.files ?? [];
      for (const file of files) {
        const relativeKey = this.fromRemoteKey(file.fileName);
        if (relativeKey === null) {
          continue;
        }
        if (this.matchExcludes(relativeKey)) {
          continue;
        }

        const item: StorageObject = {
          key: relativeKey,
          size: file.contentLength,
          lastModified: file.uploadTimestamp ? new Date(file.uploadTimestamp) : undefined,
          etag: file.contentSha1 && file.contentSha1 !== 'none' ? file.contentSha1 : undefined,
        };

        objects.push(item);

        if (progressCallback) {
          progressCallback({
            currentPath: relativeKey,
            filesScanned: objects.length,
          });
        }

        if (objects.length >= maxLimit) {
          break;
        }
      }

      nextFileName = response.nextFileName ?? undefined;
    } while (nextFileName);

    return objects;
  }

  private async resolveFile(remoteKey: string): Promise<B2FileInfo | null> {
    const response = await this.apiRequest<B2ListFileNamesResponse>('b2_list_file_names', {
      bucketId: this.config.bucketId,
      startFileName: remoteKey,
      maxFileCount: 1,
      prefix: remoteKey,
    });

    const file = response.files?.[0];
    if (!file || file.fileName !== remoteKey) {
      return null;
    }
    return file;
  }

  private async downloadFile(remoteKey: string, attempt = 0): Promise<Buffer | null> {
    const auth = await this.authorize(attempt > 0);
    const bucketName = await this.getBucketName();
    const baseUrl = `${auth.downloadUrl.replace(/\/+$/, '')}/file/${bucketName}`;
    const url = `${baseUrl}/${encodeFileName(remoteKey)}`;

    const response = await fetch(url, {
      headers: {
        Authorization: auth.token,
      },
    });

    if (response.status === 404) {
      return null;
    }

    if (response.status === 401 && attempt === 0) {
      await this.authorize(true);
      return await this.downloadFile(remoteKey, attempt + 1);
    }

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new Error(formatB2Error(response.status, body));
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  private async uploadInternal(
    remoteKey: string,
    data: Buffer,
    options?: StorageUploadOptions,
    attempt = 0,
  ): Promise<B2FileInfo> {
    const uploadAuth = await this.getUploadAuth(attempt > 0);
    const sha1 = crypto.createHash('sha1').update(data).digest('hex');

    const response = await fetch(uploadAuth.uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': uploadAuth.token,
        'X-Bz-File-Name': encodeFileName(remoteKey),
        'Content-Type': options?.contentType ?? 'b2/x-auto',
        'Content-Length': data.byteLength.toString(),
        'X-Bz-Content-Sha1': sha1,
      },
      body: data as unknown as BodyInit,
    });

    const text = await response.text();
    if ((response.status === 401 || response.status === 403 || response.status === 503) && attempt === 0) {
      this.uploadAuth = null;
      return await this.uploadInternal(remoteKey, data, options, attempt + 1);
    }

    if (!response.ok) {
      throw new Error(formatB2Error(response.status, text));
    }

    return text ? (JSON.parse(text) as B2FileInfo) : { fileName: remoteKey, fileId: '', contentLength: data.byteLength };
  }

  private async copyFile(
    sourceFile: B2FileInfo,
    targetRemoteKey: string,
    options?: StorageUploadOptions,
  ): Promise<B2CopyFileResponse> {
    const payload: Record<string, unknown> = {
      sourceFileId: sourceFile.fileId,
      fileName: targetRemoteKey,
      destinationBucketId: this.config.bucketId,
    };

    if (options?.contentType) {
      payload.metadataDirective = 'REPLACE';
      payload.contentType = options.contentType;
    }

    return await this.apiRequest<B2CopyFileResponse>('b2_copy_file', payload);
  }

  private toStorageObject(file: B2FileInfo): StorageObject | null {
    const relativeKey = this.fromRemoteKey(file.fileName);
    if (relativeKey === null) {
      return null;
    }

    return {
      key: relativeKey,
      size: file.contentLength,
      lastModified: file.uploadTimestamp ? new Date(file.uploadTimestamp) : undefined,
      etag: file.contentSha1 && file.contentSha1 !== 'none' ? file.contentSha1 : undefined,
    };
  }

  async getFile(key: string): Promise<Buffer | null> {
    const remoteKey = this.toRemoteKey(key);
    try {
      logger.b2.info(`下载文件：${remoteKey}`);
      return await this.downloadFile(remoteKey);
    }
    catch (error) {
      logger.b2.error(`下载失败：${remoteKey}`, error);
      return null;
    }
  }

  async listImages(): Promise<StorageObject[]> {
    const allFiles = await this.fetchAllFiles();
    return allFiles.filter((file) => {
      const ext = path.extname(file.key).toLowerCase();
      return SUPPORTED_FORMATS.has(ext);
    });
  }

  async listAllFiles(progressCallback?: ProgressCallback): Promise<StorageObject[]> {
    return await this.fetchAllFiles(progressCallback);
  }

  async generatePublicUrl(key: string): Promise<string> {
    const remoteKey = this.toRemoteKey(key);
    if (this.config.customDomain) {
      const base = this.config.customDomain.replace(/\/+$/, '');
      return `${base}/${encodeFileName(remoteKey)}`;
    }

    const auth = await this.authorize();
    const bucketName = await this.getBucketName();
    const base = `${auth.downloadUrl.replace(/\/+$/, '')}/file/${bucketName}`;
    return `${base}/${encodeFileName(remoteKey)}`;
  }

  detectLivePhotos(allObjects: StorageObject[]): Map<string, StorageObject> {
    const map = new Map<string, StorageObject>();
    const groups = new Map<string, StorageObject[]>();

    for (const obj of allObjects) {
      if (!obj.key)
        continue;
      const basename = obj.key.replace(/\.[^.]+$/, '');
      const list = groups.get(basename) ?? [];
      list.push(obj);
      groups.set(basename, list);
    }

    for (const files of groups.values()) {
      let imageFile: StorageObject | null = null;
      let videoFile: StorageObject | null = null;

      for (const file of files) {
        if (!file.key)
          continue;
        const ext = path.extname(file.key).toLowerCase();
        if (SUPPORTED_FORMATS.has(ext)) {
          imageFile = file;
        }
        else if (ext === '.mov') {
          videoFile = file;
        }
      }

      if (imageFile && videoFile && imageFile.key) {
        map.set(imageFile.key, videoFile);
      }
    }

    return map;
  }

  async deleteFile(key: string): Promise<void> {
    const remoteKey = this.toRemoteKey(key);
    const file = await this.resolveFile(remoteKey);
    if (!file) {
      return;
    }

    await this.apiRequest('b2_delete_file_version', {
      fileId: file.fileId,
      fileName: remoteKey,
    });
  }

  async deleteFolder(prefix: string): Promise<void> {
    const normalizedPrefix = sanitizePath(prefix);
    const targetPrefix = normalizedPrefix ? `${normalizedPrefix}/` : '';
    const allFiles = await this.listAllFiles();
    const keysToDelete = allFiles
      .map(file => file.key)
      .filter((key): key is string => Boolean(key) && (!targetPrefix || key.startsWith(targetPrefix)));

    for (const key of keysToDelete) {
      await this.deleteFile(key);
    }
  }

  async uploadFile(key: string, data: Buffer, options?: StorageUploadOptions): Promise<StorageObject> {
    const remoteKey = this.toRemoteKey(key);
    const file = await this.uploadInternal(remoteKey, data, options);
    const storageObject = this.toStorageObject({ ...file, fileName: remoteKey, contentLength: data.byteLength });
    if (!storageObject) {
      throw new Error(`上传成功但无法转换为存储对象：${remoteKey}`);
    }
    return storageObject;
  }

  async moveFile(sourceKey: string, targetKey: string, options?: StorageUploadOptions): Promise<StorageObject> {
    const sourceRemote = this.toRemoteKey(sourceKey);
    const targetRemote = this.toRemoteKey(targetKey);

    if (sourceRemote === targetRemote) {
      const file = await this.resolveFile(sourceRemote);
      if (!file) {
        throw new Error(`B2 move 失败：源文件不存在 ${sourceKey}`);
      }
      const existing = this.toStorageObject(file);
      if (!existing) {
        throw new Error(`B2 move 失败：无法解析源文件 ${sourceKey}`);
      }
      return existing;
    }

    const sourceFile = await this.resolveFile(sourceRemote);
    if (!sourceFile) {
      throw new Error(`B2 move 失败：源文件不存在 ${sourceKey}`);
    }

    const copied = await this.copyFile(sourceFile, targetRemote, options);
    await this.apiRequest('b2_delete_file_version', {
      fileId: sourceFile.fileId,
      fileName: sourceRemote,
    });

    const storageObject = this.toStorageObject({
      fileId: copied.fileId,
      fileName: copied.fileName,
      contentLength: copied.contentLength,
      contentSha1: copied.contentSha1,
      uploadTimestamp: copied.uploadTimestamp,
    });

    if (!storageObject) {
      throw new Error(`B2 move 失败：无法解析目标文件 ${targetKey}`);
    }

    return storageObject;
  }
}
