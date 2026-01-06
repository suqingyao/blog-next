'use client';

import type { ComponentProps } from 'react';
import NextImage from 'next/image';
import React, { useEffect, useState } from 'react';

import { useGetState } from '@/hooks/use-get-state';
import { useIsMobileLayout } from '@/hooks/use-mobile-layout';
import { getOptimizedImagePropsAsync } from '@/lib/image-optimizer';

export type TImageProps = {
  'className'?: string;
  'src'?: string;
  'width'?: number | string;
  'height'?: number | string;
  'original-src'?: string;
  'imageRef'?: React.RefObject<HTMLImageElement>;
  'zoom'?: boolean;
  'blurDataURL'?: string;
  'placeholder'?: 'blur' | 'empty';
  'autoOptimize'?: boolean; // 新增：是否自动应用优化
} & React.HTMLAttributes<HTMLImageElement>
& ComponentProps<typeof NextImage>;

export function Image({
  fill,
  className,
  alt,
  src,
  width,
  height,
  imageRef,
  zoom,
  blurDataURL,
  placeholder,
  autoOptimize = true, // 默认启用自动优化
  ...props
}: TImageProps) {
  const [paddingTop, setPaddingTop] = React.useState('0');
  const [autoWidth, setAutoWidth] = React.useState(0);
  const [optimizedProps, setOptimizedProps] = useState<{
    blurDataURL?: string;
    placeholder?: 'blur' | 'empty';
  }>({});
  const noOptimization = className?.includes('no-optimization');
  const imageRefInternal = React.useRef<HTMLImageElement>(null);

  const isMobileLayout = useIsMobileLayout();
  const getSrc = useGetState(src);

  // 自动加载优化属性（blur placeholder）
  useEffect(() => {
    if (!autoOptimize || noOptimization || !src)
      return;
    if (blurDataURL)
      return; // 如果已经手动提供了 blurDataURL，跳过

    // 只对本地图片应用优化
    if (src.startsWith('/photos/') || src.startsWith('photos/')) {
      getOptimizedImagePropsAsync(src).then((props) => {
        if (props.blurDataURL) {
          setOptimizedProps({
            blurDataURL: props.blurDataURL,
            placeholder: 'blur',
          });
        }
      }).catch((err) => {
        console.warn('Failed to load image optimization data:', err);
      });
    }
  }, [src, autoOptimize, noOptimization, blurDataURL]);

  useEffect(() => {
    if (!imageRef)
      return;
    if (!imageRefInternal.current)
      return;

    if (typeof imageRef === 'object') {
      imageRef.current = imageRefInternal.current;
    }
  }, [imageRef]);

  useEffect(() => {
    const $image = imageRefInternal.current;
    if (!$image)
      return;
    if (zoom) {
      if (isMobileLayout !== undefined) {
        if (isMobileLayout) {
          const clickHandler = () => {
            window.open(getSrc(), '_blank');
          };
          $image.addEventListener('click', clickHandler);
          return () => {
            $image.removeEventListener('click', clickHandler);
          };
        }
        else {
          import('medium-zoom').then(({ default: mediumZoom }) => {
            mediumZoom($image, {
              margin: 10,
              background: 'rgb(var(--tw-color-white))',
              scrollOffset: 0,
            });
          });
        }
      }
    }
  }, [zoom, isMobileLayout]);

  if (!src) {
    return null;
  }

  // 如果 src 不是绝对路径或 http 链接，则认为是本地图片，不进行优化
  if (!/^\/|^https?:\/\//.test(src)) {
    // 验证是否为有效的 URL
    let isValidUrl = false;
    try {
      isValidUrl = Boolean(new URL(src));
    }
    catch {
      // 无效的 URL
    }
    
    if (!isValidUrl) {
      return null;
    }
  }

  if (!noOptimization) {
    if (width) {
      width = +width;
    }
    if (height) {
      height = +height;
    }
  }

  const autoSize = !width && !height && !fill;

  return noOptimization
    ? (
        <img
          {...props}
          src={src}
          className={className}
          alt={alt}
          width={width}
          height={height}
          onLoad={(e: React.SyntheticEvent<HTMLImageElement>) => {
            if (autoSize) {
              const { naturalWidth, naturalHeight } = e.currentTarget;
              setPaddingTop(`calc(100% / (${naturalWidth} / ${naturalHeight})`);
              setAutoWidth(naturalWidth);
            }
          }}
          ref={imageRefInternal}
        />
      )
    : (
        <span
          className="inline-flex size-full justify-center overflow-hidden"
          style={
            autoSize
              ? {
                  maxWidth: `${autoWidth}px`,
                }
              : {}
          }
        >
          <span
            className="relative inline-flex size-full justify-center"
            style={autoSize ? { paddingTop } : {}}
          >
            <NextImage
              {...props}
              src={src}
              className={className}
              alt={alt}
              width={width}
              height={height}
              fill={fill || autoSize}
              blurDataURL={blurDataURL || optimizedProps.blurDataURL}
              placeholder={placeholder || optimizedProps.placeholder}
              onLoad={(e: React.SyntheticEvent<HTMLImageElement>) => {
                if (autoSize) {
                  const { naturalWidth, naturalHeight } = e.currentTarget;
                  setPaddingTop(`calc(100% / (${naturalWidth} / ${naturalHeight})`);
                  setAutoWidth(naturalWidth);
                }
              }}
              ref={imageRefInternal}
              loader={
                src.startsWith('ipfs://')
                  ? ({ src, width, quality }: { src: string; width: number; quality?: number }) => {
                      // https://docs.filebase.com/ipfs/about-ipfs/ipfs-gateways#filebase-ipfs-image-optimization
                      try {
                        const urlObj = new URL(src);
                        urlObj.searchParams.set(
                          'img-quality',
                          `${quality || 75}`,
                        );
                        urlObj.searchParams.set('img-format', 'auto');
                        urlObj.searchParams.set('img-onerror', 'redirect');
                        if (width) {
                          urlObj.searchParams.set('img-width', `${width}`);
                        }
                        return urlObj.toString();
                      }
                      catch {
                        return src;
                      }
                    }
                  : undefined
              }
            />
          </span>
        </span>
      );
}
