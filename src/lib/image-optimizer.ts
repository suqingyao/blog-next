/**
 * 图片优化辅助函数
 * 自动读取预生成的图片元数据，提供 blur placeholder 和响应式图片支持
 */

import process from 'node:process';

export interface ImageMetadata {
  width: number;
  height: number;
  blurhash?: string | null;
  blurDataURL?: string | null; // Keep for backward compatibility if needed
  webp?: string;
  sizes?: Record<number, { jpeg: string; webp: string }>;
}

export interface OptimizedImageProps {
  src: string;
  width?: number;
  height?: number;
  blurDataURL?: string;
  blurhash?: string;
  placeholder?: 'blur' | 'empty';
  sizes?: string;
}

// 动态导入图片元数据（在运行时获取）
let imageMetadataCache: Record<string, ImageMetadata> | null = null;

/**
 * 获取图片元数据
 */
async function getImageMetadata(): Promise<Record<string, ImageMetadata>> {
  if (imageMetadataCache) {
    return imageMetadataCache;
  }

  try {
    // 在客户端和服务端都能工作
    const response = await fetch('/image-metadata.json');
    if (response.ok) {
      const data = await response.json() as Record<string, ImageMetadata>;
      imageMetadataCache = data;
      return data;
    }
  }
  catch (error) {
    console.warn('Failed to load image metadata:', error);
  }

  return {};
}

/**
 * 同步获取图片元数据（仅在服务端使用）
 */
export function getImageMetadataSync(): Record<string, ImageMetadata> {
  try {
    // 仅在 Node.js 环境中使用
    if (typeof window === 'undefined') {
      // 动态导入 Node.js 模块，避免在客户端打包
      // eslint-disable-next-line ts/no-require-imports
      const fs = require('node:fs');
      // eslint-disable-next-line ts/no-require-imports
      const path = require('node:path');
      const metadataPath = path.join(process.cwd(), 'public/image-metadata.json');

      if (fs.existsSync(metadataPath)) {
        const data = fs.readFileSync(metadataPath, 'utf-8');
        return JSON.parse(data) as Record<string, ImageMetadata>;
      }
    }
  }
  catch (error) {
    console.warn('Failed to load image metadata sync:', error);
  }

  return {};
}

/**
 * 获取单张图片的优化属性
 */
export function getOptimizedImageProps(
  src: string,
  metadata?: Record<string, ImageMetadata>,
): Partial<OptimizedImageProps> {
  // 如果没有传入 metadata，尝试同步加载（仅服务端）
  const meta = metadata || getImageMetadataSync();

  // 标准化路径
  let normalizedSrc = src;
  if (!src.startsWith('/') && !src.startsWith('http')) {
    normalizedSrc = `/${src}`;
  }

  const imageData = meta[normalizedSrc];

  if (!imageData) {
    // 如果没有元数据，返回原始 src
    return { src };
  }

  // 构建响应式 sizes 属性
  const sizeEntries = imageData.sizes ? Object.entries(imageData.sizes) : [];
  const sizes = sizeEntries.length > 0
    ? `(max-width: 640px) 640px, (max-width: 1080px) 1080px, 1920px`
    : undefined;

  return {
    src: imageData.webp || src, // 优先使用 WebP
    width: imageData.width,
    height: imageData.height,
    blurDataURL: imageData.blurDataURL || undefined,
    blurhash: imageData.blurhash || undefined,
    placeholder: (imageData.blurDataURL || imageData.blurhash) ? 'blur' : undefined,
    sizes,
  };
}

/**
 * 客户端异步获取优化属性
 */
export async function getOptimizedImagePropsAsync(
  src: string,
): Promise<Partial<OptimizedImageProps>> {
  const metadata = await getImageMetadata();
  return getOptimizedImageProps(src, metadata);
}

/**
 * 获取图片的 blur data URL
 */
export function getBlurDataURL(src: string, metadata?: Record<string, ImageMetadata>): string | undefined {
  const meta = metadata || getImageMetadataSync();

  let normalizedSrc = src;
  if (!src.startsWith('/') && !src.startsWith('http')) {
    normalizedSrc = `/${src}`;
  }

  return meta[normalizedSrc]?.blurDataURL || undefined;
}

/**
 * 批量获取多张图片的优化属性
 */
export function getBatchOptimizedProps(
  sources: string[],
  metadata?: Record<string, ImageMetadata>,
): Record<string, Partial<OptimizedImageProps>> {
  const meta = metadata || getImageMetadataSync();
  const result: Record<string, Partial<OptimizedImageProps>> = {};

  for (const src of sources) {
    result[src] = getOptimizedImageProps(src, meta);
  }

  return result;
}
