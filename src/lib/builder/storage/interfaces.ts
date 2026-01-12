import type { Buffer } from 'node:buffer';

// 扫描进度接口
export interface ScanProgress {
  currentPath: string;
  filesScanned: number;
  totalFiles?: number;
}

// 进度回调类型
export type ProgressCallback = (progress: ScanProgress) => void;

// 存储对象的通用接口
export interface StorageObject {
  key: string;
  size?: number;
  lastModified?: Date;
  etag?: string;
}

export type StorageUploadStatus = 'start' | 'progress' | 'complete' | 'error';

export interface StorageUploadProgress {
  key: string;
  status: StorageUploadStatus;
  provider?: StorageConfig['provider'];
  size?: number;
  bytesUploaded?: number;
  totalBytes?: number;
  elapsedMs?: number;
  error?: unknown;
  metadata?: Record<string, unknown> | null;
}

export type StorageUploadProgressHandler = (progress: StorageUploadProgress) => Promise<void> | void;

export interface StorageUploadOptions {
  contentType?: string;
  onProgress?: StorageUploadProgressHandler;
}

// 存储提供商的通用接口
export interface StorageProvider {
  /**
   * 从存储中获取文件
   * @param key 文件的键值/路径
   * @param logger 可选的日志记录器
   * @returns 文件的 Buffer 数据，如果不存在则返回 null
   */
  getFile: (key: string) => Promise<Buffer | null>;

  /**
   * 列出存储中的所有图片文件
   * @returns 图片文件对象数组
   */
  listImages: () => Promise<StorageObject[]>;

  /**
   * 列出存储中的所有文件
   * @param progressCallback 可选的进度回调函数
   * @returns 所有文件对象数组
   */
  listAllFiles: (progressCallback?: ProgressCallback) => Promise<StorageObject[]>;

  /**
   * 生成文件的公共访问 URL
   * @param key 文件的键值/路径
   * @returns 公共访问 URL
   */
  generatePublicUrl: (key: string) => string | Promise<string>;

  /**
   * 检测 Live Photos 配对
   * @param allObjects 所有文件对象
   * @returns Live Photo 配对映射 (图片 key -> 视频对象)
   */
  detectLivePhotos: (allObjects: StorageObject[]) => Map<string, StorageObject>;

  /**
   * 从存储中删除文件
   */
  deleteFile: (key: string) => Promise<void>;

  /**
   * 删除指定前缀下的所有文件（通常对应一个“目录”）
   * @param prefix 需要删除的目录或前缀（不需要以 / 开头）
   */
  deleteFolder: (prefix: string) => Promise<void>;

  /**
   * 向存储上传文件
   * @param key 文件的键值/路径
   * @param data 文件数据
   * @param options 上传选项
   */
  uploadFile: (key: string, data: Buffer, options?: StorageUploadOptions) => Promise<StorageObject>;

  /**
   * 将存储中的文件移动到新的键值/路径
   * @param sourceKey 原文件键值
   * @param targetKey 目标文件键值
   * @param options 上传选项（供部分存储在复制时复用）
   */
  moveFile: (sourceKey: string, targetKey: string, options?: StorageUploadOptions) => Promise<StorageObject>;
}

interface BaseS3LikeConfig {
  bucket?: string;
  region?: string;
  endpoint?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  sessionToken?: string;
  prefix?: string;
  customDomain?: string;
  excludeRegex?: string;
  maxFileLimit?: number;
  // Network tuning (optional)
  keepAlive?: boolean;
  maxSockets?: number;
  connectionTimeoutMs?: number;
  socketTimeoutMs?: number;
  requestTimeoutMs?: number;
  idleTimeoutMs?: number;
  totalTimeoutMs?: number;
  retryMode?: 'standard' | 'adaptive' | 'legacy';
  maxAttempts?: number;
  // Download concurrency limiter within a single process/worker
  downloadConcurrency?: number;
  /**
   * Optional override for the SigV4 service name. Defaults to:
   * - `s3` for AWS or generic S3-compatible endpoints
   * - `oss` for Aliyun OSS
   * - `s3` for Tencent COS
   */
  sigV4Service?: string;
}

export type S3Config = BaseS3LikeConfig & {
  provider: 's3';
};

export type OSSConfig = BaseS3LikeConfig & {
  provider: 'oss';
};

export type COSConfig = BaseS3LikeConfig & {
  provider: 'cos';
};

export type S3CompatibleConfig = S3Config | OSSConfig | COSConfig;

export interface B2Config {
  provider: 'b2';
  applicationKeyId: string;
  applicationKey: string;
  bucketId: string;
  bucketName?: string;
  prefix?: string;
  customDomain?: string;
  excludeRegex?: string;
  maxFileLimit?: number;
  authorizationTtlMs?: number;
  uploadUrlTtlMs?: number;
}

export interface GitHubConfig {
  provider: 'github';
  owner: string;
  repo: string;
  branch?: string;
  token?: string;
  path?: string;
  useRawUrl?: boolean;
  /**
   * Optional custom CDN domain for generated URLs.
   * When set, URLs will use this domain instead of raw.githubusercontent.com.
   * Useful for jsDelivr, Cloudflare CDN, or other GitHub CDN proxies.
   * @example 'cdn.jsdelivr.net/gh/owner/repo@branch'
   * @example 'cdn.example.com'
   */
  customDomain?: string;
}

export interface LocalConfig {
  provider: 'local';
  basePath: string; // 本地照片存储的基础路径
  baseUrl?: string; // 用于生成公共 URL 的基础 URL（可选）
  /**
   * 本地照片存储需要被复制到的目录。
   *
   * 注意：操作会覆盖目标目录下的同名文件。
   */
  distPath?: string;
  excludeRegex?: string; // 排除文件的正则表达式
  maxFileLimit?: number; // 最大文件数量限制
}

export type EagleRule
  = | {
    type: 'tag';
    name: string;
  }
  | {
    type: 'folder';
    /**
     * Only a folder name, not the full path.
     */
    name: string;
    /**
     * Defaults to `false`.
     */
    includeSubfolder?: boolean;
  }
  | {
    /**
     * Smart folders are not yet supported.
     */
    type: 'smartFolder';
  };

export interface EagleConfig {
  provider: 'eagle';
  /**
   * The path to the Eagle library.
   */
  libraryPath: string;
  /**
   * The path where original files need to be stored.
   * The original files will be copied to this path during the build process.
   *
   * Defaults to `web/public/originals/`
   */
  distPath?: string;
  /**
   * The base URL to access the original files.
   *
   * Defaults to `/originals/`
   */
  baseUrl?: string;
  include?: EagleRule[];
  exclude?: EagleRule[];
  /**
   * When enabled, also add Eagle folder names as tags for each image.
   * Defaults to false.
   */
  folderAsTag?: boolean;
  /**
   * Omit these tag names only from the manifest display (metadata) output.
   * Exact match, case-sensitive. Does not affect which images are included/excluded.
   */
  omitTagNamesInMetadata?: string[];
}

/**
 * Additional storage configuration surface that downstream projects can extend via
 * module augmentation, e.g.
 *
 * declare module '@afilmory/builder/storage/interfaces.js' {
 *   interface CustomStorageConfig {
 *     provider: 'my-provider'
 *     foo?: string
 *   }
 * }
 */
export interface CustomStorageConfig {
  provider: string;
  [key: string]: unknown;
}

export type RemoteStorageProviderName = 's3' | 'oss' | 'cos' | 'b2' | 'github';
export type LocalStorageProviderName = 'eagle' | 'local';

export const REMOTE_STORAGE_PROVIDERS: readonly RemoteStorageProviderName[] = ['s3', 'oss', 'cos', 'b2', 'github'];
export const LOCAL_STORAGE_PROVIDERS: readonly LocalStorageProviderName[] = ['eagle', 'local'];

export type RemoteStorageConfig = S3CompatibleConfig | B2Config | GitHubConfig;
export type LocalStorageConfig = EagleConfig | LocalConfig;

export interface ManagedStorageConfig {
  provider: 'managed';
  tenantId: string;
  providerKey?: string | null;
  basePrefix?: string | null;
  upstream: RemoteStorageConfig;
}

export type StorageConfig = RemoteStorageConfig | LocalStorageConfig | ManagedStorageConfig | CustomStorageConfig;

export type StorageProviderCategory = 'remote' | 'local';
