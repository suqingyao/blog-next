'use client';

import { useState } from 'react';
import type { ImgHTMLAttributes, ReactNode } from 'react';

import { Skeleton } from './ui/skeleton';

import { cn } from '@/lib/utils';
import { useInView } from '@/hooks/use-in-view';

export type LazyImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  placeholder?: ReactNode;
  fallbackSrc?: string;
  loadedSrcs?: Set<string>;
};

const DEFAULT_FALLBACK = '/broken-image.png';

export const LazyImage = (props: LazyImageProps) => {
  const {
    className,
    src,
    alt,
    placeholder,
    fallbackSrc = DEFAULT_FALLBACK,
    width,
    height,
    onLoad,
    onError,
    loadedSrcs,
    ...rest
  } = props;

  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const [targetRef, isInView] = useInView({
    triggerOnce: true,
    rootMargin: '0px',
    threshold: 0.1
  });

  const alreadyLoaded = src && loadedSrcs?.has(src);

  const imgSrc = hasError ? fallbackSrc : src;

  return (
    <div
      ref={targetRef}
      style={{ display: 'inline-block', width, height }}
    >
      <Skeleton
        type="image"
        width={width}
        height={height}
      >
        {alreadyLoaded || isInView ? (
          <img
            className={cn(
              'h-full w-full object-cover opacity-0 transition-opacity duration-500',
              isLoaded && 'opacity-100',
              className
            )}
            onLoad={(e) => {
              setIsLoaded(true);
              onLoad?.(e);
            }}
            onError={(e) => {
              setHasError(true);
              setIsLoaded(true);
              onError?.(e);
            }}
            src={imgSrc}
            alt={alt}
            width={width}
            height={height}
            loading="lazy"
            {...rest}
          />
        ) : (
          placeholder || null
        )}
      </Skeleton>
    </div>
  );
};
