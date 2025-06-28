'use client';

import { useState } from 'react';
import type { ImgHTMLAttributes, ReactNode } from 'react';

import { Skeleton } from './ui/skeleton';

import { cn } from '@/lib/utils';
import { useInView } from '@/hooks/use-in-view';

export type LazyImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  placeholder?: ReactNode;
  fallbackSrc?: string;
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
    ...rest
  } = props;

  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const [targetRef, isInView] = useInView({
    triggerOnce: true,
    rootMargin: '200px',
    threshold: 0.1
  });

  const imgSrc = hasError ? fallbackSrc : src;

  return (
    <span
      ref={targetRef}
      style={{ display: 'inline-block', width, height }}
    >
      <Skeleton
        type="image"
        width={width}
        height={height}
      >
        {isInView ? (
          <img
            className={cn(
              'h-full w-full rounded-md object-cover opacity-0 transition-opacity duration-500',
              isLoaded && 'opacity-100'
            )}
            onLoad={() => setIsLoaded(true)}
            onError={() => {
              setHasError(true);
              setIsLoaded(true);
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
    </span>
  );
};
