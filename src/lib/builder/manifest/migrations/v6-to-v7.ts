import type { AfilmoryManifest } from '../../types/manifest.js';
import type { ManifestMigrator, MigrationContext } from '../migrate.js';

/**
 * Migration: v6 -> v7
 * 将缩略图 URL 从 .webp 替换为 .jpg
 */
export const migrateV6ToV7: ManifestMigrator = (raw: AfilmoryManifest, _ctx: MigrationContext) => {
  raw.data.forEach((item) => {
    if (typeof item.thumbnailUrl === 'string') {
      item.thumbnailUrl = item.thumbnailUrl.replace(/\.webp$/, '.jpg');
    }
  })
  // 更新版本号为目标版本
  ;(raw as any).version = 'v7';
  return raw;
};
