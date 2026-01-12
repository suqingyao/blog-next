import type { AfilmoryManifest } from '../../types/manifest.js';
import type { ManifestMigrator, MigrationContext } from '../migrate.js';
import { logger } from '../../logger/index.js';

/**
 * Migration: v1 -> v6
 * 无效的 manifest 版本，创建新的 manifest 文件
 */
export const migrateV1ToV6: ManifestMigrator = (_raw: AfilmoryManifest, _ctx: MigrationContext) => {
  logger.fs.error('🔍 无效的 manifest 版本，创建新的 manifest 文件...');
  return {
    version: 'v6',
    data: [],
    cameras: [],
    lenses: [],
  };
};
