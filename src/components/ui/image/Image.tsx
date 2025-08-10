'use client';

import type { ImageProps } from 'next/image';
import { default as NextImage } from 'next/image';
import React, { useEffect } from 'react';

import { useGetState } from '@/hooks/use-get-state';
import { useIsMobileLayout } from '@/hooks/use-mobile-layout';

export type TImageProps = {
  'className'?: string;
  'src'?: string;
  'width'?: number | string;
  'height'?: number | string;
  'original-src'?: string;
  'imageRef'?: React.RefObject<HTMLImageElement>;
  'zoom'?: boolean;
  'blurDataURL'?: string;
  'placeholder'?: 'blur';
} & React.HTMLAttributes<HTMLImageElement>
& ImageProps;

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
  ...props
}: TImageProps) {
  const [paddingTop, setPaddingTop] = React.useState('0');
  const [autoWidth, setAutoWidth] = React.useState(0);
  const noOptimization = className?.includes('no-optimization');
  const imageRefInternal = React.useRef<HTMLImageElement>(null);

  const isMobileLayout = useIsMobileLayout();
  const getSrc = useGetState(src);

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
    try {
      new URL(src);
    }
    catch (error) {
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

  return noOptimization ? (
    <img
      {...props}
      src={src}
      className={className}
      alt={alt}
      width={width}
      height={height}
      onLoad={({ target }) => {
        if (autoSize) {
          const { naturalWidth, naturalHeight } = target as HTMLImageElement;
          setPaddingTop(`calc(100% / (${naturalWidth} / ${naturalHeight})`);
          setAutoWidth(naturalWidth);
        }
      }}
      ref={imageRefInternal}
    />
  ) : (
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
          blurDataURL={blurDataURL}
          placeholder={placeholder}
          onLoad={({ target }) => {
            if (autoSize) {
              const { naturalWidth, naturalHeight }
                = target as HTMLImageElement;
              setPaddingTop(`calc(100% / (${naturalWidth} / ${naturalHeight})`);
              setAutoWidth(naturalWidth);
            }
          }}
          ref={imageRefInternal}
          loader={
            src.startsWith('ipfs://')
              ? ({ src, width, quality }) => {
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
                  catch (error) {
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
