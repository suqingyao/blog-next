import type { SimpleS3Client } from '../../s3/client.js';
import type { S3CompatibleConfig } from '../interfaces.js';
import { createS3Client, encodeS3Key } from '../../s3/client.js';
import { sanitizeS3Etag } from './s3-utils.js';

export class S3ProviderClient {
  private readonly client: SimpleS3Client;

  constructor(config: S3CompatibleConfig) {
    this.client = createS3Client(config);
  }

  buildObjectUrl(key?: string): string {
    return this.client.buildObjectUrl(key);
  }

  async getObject(key: string, init?: RequestInit): Promise<Response> {
    return await this.client.fetch(this.buildObjectUrl(key), {
      method: 'GET',
      ...init,
    });
  }

  async headObject(key: string): Promise<Response> {
    return await this.client.fetch(this.buildObjectUrl(key), {
      method: 'HEAD',
    });
  }

  async putObject(key: string, body: BodyInit, headers?: HeadersInit): Promise<Response> {
    return await this.client.fetch(this.buildObjectUrl(key), {
      method: 'PUT',
      body,
      headers,
    });
  }

  async deleteObject(key: string): Promise<Response> {
    return await this.client.fetch(this.buildObjectUrl(key), {
      method: 'DELETE',
    });
  }

  async copyObject(sourceKey: string, targetKey: string, headers?: HeadersInit): Promise<Response> {
    const copySource = `/${this.client.bucket}/${encodeS3Key(sourceKey)}`;
    return await this.client.fetch(this.buildObjectUrl(targetKey), {
      method: 'PUT',
      headers: {
        'x-amz-copy-source': copySource,
        ...headers,
      },
    });
  }

  async listObjects(params?: {
    prefix?: string | null;
    maxKeys?: number;
    continuationToken?: string;
  }): Promise<Response> {
    const url = new URL(this.buildObjectUrl());
    url.searchParams.set('list-type', '2');
    if (params?.prefix) {
      url.searchParams.set('prefix', encodeS3Key(params.prefix));
    }
    if (params?.maxKeys) {
      url.searchParams.set('max-keys', String(params.maxKeys));
    }
    if (params?.continuationToken) {
      url.searchParams.set('continuation-token', params.continuationToken);
    }
    return await this.client.fetch(url.toString(), { method: 'GET' });
  }

  async moveObject(
    sourceKey: string,
    targetKey: string,
    options?: { headers?: HeadersInit },
  ): Promise<{ metadata: { key: string; size?: number; etag?: string | null; lastModified?: Date } }> {
    const copyResponse = await this.copyObject(sourceKey, targetKey, options?.headers);
    if (!copyResponse.ok) {
      const text = await copyResponse.text().catch(() => '');
      throw new Error(
        `复制 S3 对象失败：${sourceKey} -> ${targetKey} (status ${copyResponse.status}) ${text ? text.slice(0, 200) : ''}`,
      );
    }

    let metadata: { key: string; size?: number; etag?: string | null; lastModified?: Date } = { key: targetKey };
    const headResponse = await this.headObject(targetKey);
    if (headResponse.ok) {
      const size = headResponse.headers.get('content-length');
      const etag = headResponse.headers.get('etag');
      const lastModified = headResponse.headers.get('last-modified');
      metadata = {
        key: targetKey,
        size: size ? Number(size) : undefined,
        etag: sanitizeS3Etag(etag) ?? null,
        lastModified: lastModified ? new Date(lastModified) : undefined,
      };
    }

    const deleteResponse = await this.deleteObject(sourceKey);
    if (!deleteResponse.ok) {
      await this.deleteObject(targetKey).catch(() => {
        /* ignore */
      });
      const text = await deleteResponse.text().catch(() => '');
      throw new Error(
        `删除源对象失败：${sourceKey} (status ${deleteResponse.status}) ${text ? text.slice(0, 200) : ''}`,
      );
    }

    return { metadata };
  }
}
