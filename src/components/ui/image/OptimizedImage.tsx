import type { ComponentProps } from 'react';
import NextImage from 'next/image';
import { getOptimizedImageProps } from '@/lib/image-optimizer';

export interface OptimizedImageProps extends Omit<ComponentProps<typeof NextImage>, 'src'> {
  src: string;
  alt: string;
  className?: string;
  autoOptimize?: boolean;
}

/**
 * 服务端渲染的优化图片组件
 * 在构建时自动读取 blur placeholder 和响应式尺寸
 */
export function OptimizedImage({
  src,
  alt,
  autoOptimize = true,
  blurDataURL,
  placeholder,
  ...props
}: OptimizedImageProps) {
  let optimizedProps = {};

  // 自动应用优化
  if (autoOptimize && (src.startsWith('/photos/') || src.startsWith('photos/'))) {
    try {
      optimizedProps = getOptimizedImageProps(src);
    }
    catch (error) {
      console.warn(`Failed to load optimization for ${src}:`, error);
    }
  }

  return (
    <NextImage
      {...props}
      {...optimizedProps}
      src={src}
      alt={alt}
      // 手动提供的属性优先级更高
      blurDataURL={blurDataURL || (optimizedProps as any).blurDataURL}
      placeholder={placeholder || (optimizedProps as any).placeholder}
    />
  );
}
