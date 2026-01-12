import type { S3CompatibleConfig } from '../../storage/interfaces.js';
import type { BuilderPlugin } from '../types.js';
import { S3StorageProvider } from '../../storage/providers/s3-provider.js';

export interface S3StoragePluginOptions {
  provider?: string;
}

export default function s3StoragePlugin(options: S3StoragePluginOptions = {}): BuilderPlugin {
  const providerName = options.provider ?? 's3';

  return {
    name: `afilmory:storage:${providerName}`,
    hooks: {
      onInit: ({ registerStorageProvider }) => {
        registerStorageProvider(
          providerName,
          (config) => {
            return new S3StorageProvider(config as S3CompatibleConfig);
          },
          { category: 'remote' },
        );
      },
    },
  };
}
