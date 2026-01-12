import type { StorageConfig, StorageProvider, StorageProviderCategory } from './interfaces.js';
import { LOCAL_STORAGE_PROVIDERS, REMOTE_STORAGE_PROVIDERS } from './interfaces.js';

export type StorageProviderFactory<T extends StorageConfig = StorageConfig> = (config: T) => StorageProvider;

export interface StorageProviderRegistrationOptions {
  category?: StorageProviderCategory;
}

interface StorageProviderRegistration {
  factory: StorageProviderFactory;
  category: StorageProviderCategory;
}

const BUILTIN_PROVIDER_CATEGORY = new Map<string, StorageProviderCategory>([
  ...REMOTE_STORAGE_PROVIDERS.map(provider => [provider, 'remote'] as const),
  ...LOCAL_STORAGE_PROVIDERS.map(provider => [provider, 'local'] as const),
]);

export class StorageFactory {
  private static providers = new Map<string, StorageProviderRegistration>();

  /**
   * Register or override a storage provider factory.
   */
  static registerProvider(
    provider: string,
    factory: StorageProviderFactory,
    options?: StorageProviderRegistrationOptions,
  ): void {
    StorageFactory.providers.set(provider, {
      factory,
      category: StorageFactory.resolveCategory(provider, options),
    });
  }

  /**
   * 根据配置创建存储提供商实例
   * @param config 存储配置
   * @returns 存储提供商实例
   */
  static createProvider(config: StorageConfig): StorageProvider {
    const registration = StorageFactory.providers.get(config.provider);

    if (!registration) {
      throw new Error(`Unsupported storage provider: ${config.provider as string}`);
    }

    return registration.factory(config);
  }

  static getRegisteredProviders(category?: StorageProviderCategory): string[] {
    const entries = Array.from(StorageFactory.providers.entries());
    if (!category) {
      return entries.map(([provider]) => provider);
    }

    return entries.filter(([, registration]) => registration.category === category).map(([provider]) => provider);
  }

  static getProviderCategory(provider: string): StorageProviderCategory | null {
    return StorageFactory.providers.get(provider)?.category ?? BUILTIN_PROVIDER_CATEGORY.get(provider) ?? null;
  }

  private static resolveCategory(
    provider: string,
    options?: StorageProviderRegistrationOptions,
  ): StorageProviderCategory {
    if (options?.category) {
      return options.category;
    }

    return BUILTIN_PROVIDER_CATEGORY.get(provider) ?? 'remote';
  }
}
