import type { Buffer } from 'node:buffer';
import type { AfilmoryBuilder } from '../builder/builder.js';

import type { StorageManager } from '../storage/index.js';
import type { B2Config, GitHubConfig, S3CompatibleConfig, StorageConfig } from '../storage/interfaces.js';
import type { PhotoProcessingLoggers } from './logger-adapter.js';
import { AsyncLocalStorage } from 'node:async_hooks';

export interface PhotoExecutionContext {
  builder: AfilmoryBuilder;
  storageManager: StorageManager;
  storageConfig: StorageConfig;
  normalizeStorageKey: (key: string) => string;
  loggers?: PhotoProcessingLoggers;
  prefetchedBuffers?: Map<string, Buffer>;
}

const photoContextStorage = new AsyncLocalStorage<PhotoExecutionContext>();

export function runWithPhotoExecutionContext<T>(
  context: PhotoExecutionContext,
  callback: () => T | Promise<T>,
): T | Promise<T> {
  return photoContextStorage.run(context, callback);
}

export function getPhotoExecutionContext(): PhotoExecutionContext {
  const context = photoContextStorage.getStore();
  if (!context) {
    throw new Error('Photo execution context is not available');
  }
  return context;
}

function sanitizeStoragePath(value: string | undefined | null): string {
  if (!value)
    return '';
  return value.replaceAll('\\', '/').replaceAll(/\/+/g, '/').replace(/^\/+/, '').replace(/\/+$/, '');
}

/**
 * 创建一个用于标准化存储键值的函数
 * 会去除配置中的 prefix/path 等前缀，并统一路径分隔符
 */
export function createStorageKeyNormalizer(storageConfig: StorageConfig): (key: string) => string {
  let basePrefix = '';

  switch (storageConfig.provider) {
    case 's3':
    case 'oss':
    case 'cos': {
      basePrefix = sanitizeStoragePath((storageConfig as S3CompatibleConfig).prefix);
      break;
    }
    case 'b2': {
      basePrefix = sanitizeStoragePath((storageConfig as B2Config).prefix);
      break;
    }
    case 'github': {
      basePrefix = sanitizeStoragePath((storageConfig as GitHubConfig).path);
      break;
    }
    default: {
      basePrefix = '';
    }
  }

  const prefixWithSlash = basePrefix ? `${basePrefix}/` : '';

  return (rawKey: string): string => {
    if (!rawKey)
      return '';

    const sanitizedKey = rawKey.replaceAll('\\', '/').replaceAll(/\/+/g, '/').replace(/^\/+/, '');

    if (!basePrefix) {
      return sanitizedKey;
    }

    if (sanitizedKey === basePrefix) {
      return '';
    }

    if (sanitizedKey.startsWith(prefixWithSlash)) {
      return sanitizedKey.slice(prefixWithSlash.length);
    }

    return sanitizedKey;
  };
}
