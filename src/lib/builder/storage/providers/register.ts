import type { StorageProviderFactory } from '../factory.js';
import type {
  B2Config,
  COSConfig,
  EagleConfig,
  GitHubConfig,
  LocalConfig,
  OSSConfig,
  S3Config,
  StorageProviderCategory,
} from '../interfaces.js';
import { StorageFactory } from '../factory.js';
import { B2StorageProvider } from './b2-provider.js';
import { EagleStorageProvider } from './eagle-provider.js';
import { GitHubStorageProvider } from './github-provider.js';
import { LocalStorageProvider } from './local-provider.js';
import { S3StorageProvider } from './s3-provider.js';

interface BuiltinProviderRegistration {
  name: string;
  factory: StorageProviderFactory;
  category: StorageProviderCategory;
}

const BUILTIN_PROVIDER_REGISTRATIONS: BuiltinProviderRegistration[] = [
  {
    name: 's3',
    category: 'remote',
    factory: config => new S3StorageProvider(config as S3Config),
  },
  {
    name: 'oss',
    category: 'remote',
    factory: config => new S3StorageProvider(config as OSSConfig),
  },
  {
    name: 'cos',
    category: 'remote',
    factory: config => new S3StorageProvider(config as COSConfig),
  },
  {
    name: 'b2',
    category: 'remote',
    factory: config => new B2StorageProvider(config as B2Config),
  },
  {
    name: 'github',
    category: 'remote',
    factory: config => new GitHubStorageProvider(config as GitHubConfig),
  },
  {
    name: 'local',
    category: 'local',
    factory: config => new LocalStorageProvider(config as LocalConfig),
  },
  {
    name: 'eagle',
    category: 'local',
    factory: config => new EagleStorageProvider(config as EagleConfig),
  },
];

for (const registration of BUILTIN_PROVIDER_REGISTRATIONS) {
  StorageFactory.registerProvider(registration.name, registration.factory, {
    category: registration.category,
  });
}

export function getBuiltinStorageProviders(): readonly BuiltinProviderRegistration[] {
  return BUILTIN_PROVIDER_REGISTRATIONS;
}
