import type { AfilmoryManifest } from '../../types/manifest.js';
import type { ManifestMigrator, MigrationContext } from '../migrate.js';
import { logger } from '../../logger/index.js';

/**
 * Migration: v7 -> v8
 * 将 Live Photo/Motion Photo 字段转换为 VideoSource sum type
 */
export const migrateV7ToV8: ManifestMigrator = (raw: AfilmoryManifest, _ctx: MigrationContext) => {
  logger.main.info('🔄 迁移 v7 -> v8: 将 Live Photo/Motion Photo 字段转换为 VideoSource sum type');

  raw.data.forEach((item: any) => {
    // 转换为 VideoSource sum type
    if (item.motionPhotoOffset !== undefined && item.motionPhotoOffset > 0) {
      // Motion Photo: 嵌入视频
      item.video = {
        type: 'motion-photo',
        offset: item.motionPhotoOffset,
        ...(item.motionPhotoVideoSize && { size: item.motionPhotoVideoSize }),
        ...(item.presentationTimestampUs && { presentationTimestamp: item.presentationTimestampUs }),
      };
    }
    else if (item.isLivePhoto && item.livePhotoVideoUrl) {
      // Live Photo: 独立视频文件
      // 仅在 s3Key 存在时创建 video 对象，避免无效元数据
      if (item.livePhotoVideoS3Key) {
        item.video = {
          type: 'live-photo',
          videoUrl: item.livePhotoVideoUrl,
          s3Key: item.livePhotoVideoS3Key,
        };
      }
      else {
        logger.main.warn(`⚠️ 照片 ${item.id || item.url} 的 Live Photo 数据不完整（缺少 s3Key），跳过 video 字段生成`);
      }
    }
    // 如果两者都不是，video 字段保持 undefined

    // 删除旧字段
    delete item.isLivePhoto;
    delete item.livePhotoVideoUrl;
    delete item.livePhotoVideoS3Key;
    delete item.motionPhotoOffset;
    delete item.motionPhotoVideoSize;
    delete item.presentationTimestampUs;
  })

  // 更新版本号为目标版本
  ;(raw as any).version = 'v8';
  return raw;
};
