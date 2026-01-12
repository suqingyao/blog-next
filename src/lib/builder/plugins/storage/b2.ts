import type { B2Config } from '../../storage/interfaces.js';
import type { BuilderPlugin } from '../types.js';
import { B2StorageProvider } from '../../storage/providers/b2-provider.js';

export interface B2StoragePluginOptions {
  provider?: string;
}

export default function b2StoragePlugin(options: B2StoragePluginOptions = {}): BuilderPlugin {
  const providerName = options.provider ?? 'b2';

  return {
    name: `afilmory:storage:${providerName}`,
    hooks: {
      onInit: ({ registerStorageProvider }) => {
        registerStorageProvider(
          providerName,
          (config) => {
            return new B2StorageProvider(config as B2Config);
          },
          { category: 'remote' },
        );
      },
    },
  };
}
