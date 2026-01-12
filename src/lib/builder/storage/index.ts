import './providers/register.js';

// 导出工厂类
export type { StorageProviderFactory, StorageProviderRegistrationOptions } from './factory.js';
export { StorageFactory } from './factory.js';

// 导出接口
export type {
  LocalStorageConfig,
  LocalStorageProviderName,
  ProgressCallback,
  RemoteStorageConfig,
  RemoteStorageProviderName,
  ScanProgress,
  StorageConfig,
  StorageObject,
  StorageProvider,
  StorageProviderCategory,
} from './interfaces.js';
export { LOCAL_STORAGE_PROVIDERS, REMOTE_STORAGE_PROVIDERS } from './interfaces.js';

// 导出管理器
export type { StorageUploadProgress, StorageUploadProgressHandler } from './interfaces.js';
export { StorageManager } from './manager.js';

// 导出具体提供商（如果需要直接使用）
export { B2StorageProvider } from './providers/b2-provider.js';
export { EagleStorageProvider } from './providers/eagle-provider.js';
export { GitHubStorageProvider } from './providers/github-provider.js';
export { LocalStorageProvider } from './providers/local-provider.js';
export { S3StorageProvider } from './providers/s3-provider.js';
