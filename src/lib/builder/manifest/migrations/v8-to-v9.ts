import type { AfilmoryManifest } from '../../types/manifest.js';

import type { ManifestMigrator, MigrationContext } from '../migrate.js';
import path from 'node:path';

/**
 * Migration: v8 -> v9
 * 补全 format 字段
 */
export const migrateV8ToV9: ManifestMigrator = (raw: AfilmoryManifest, _ctx: MigrationContext) => {
  if (!Array.isArray(raw.data)) {
    raw.data = [];
  }

  raw.data.forEach((item: Record<string, any>) => {
    if (!item || typeof item !== 'object')
      return;
    const existing = typeof item.format === 'string' ? item.format.trim() : '';
    if (existing) {
      item.format = existing.toUpperCase();
      return;
    }

    const inferred = inferFormatFromManifestItem(item);
    item.format = inferred ?? 'UNKNOWN';
  })
  ;(raw as any).version = 'v9';
  return raw;
};

function inferFormatFromManifestItem(item: Record<string, any>): string | null {
  const s3Format = extractFormatFromPath(item.s3Key);
  if (s3Format)
    return s3Format;

  const originalFormat = extractFormatFromPath(item.originalUrl);
  if (originalFormat)
    return originalFormat;

  const thumbFormat = extractFormatFromPath(item.thumbnailUrl);
  if (thumbFormat)
    return thumbFormat;

  return null;
}

function extractFormatFromPath(input?: string | null): string | null {
  if (!input || typeof input !== 'string') {
    return null;
  }

  let target = input.trim();
  if (!target) {
    return null;
  }

  try {
    const parsed = new URL(target);
    target = parsed.pathname || target;
  }
  catch {
    // Not a URL string – keep original path
  }

  const ext = path.extname(target);
  if (!ext) {
    return null;
  }

  const normalized = ext.slice(1).toUpperCase();
  return normalized || null;
}
