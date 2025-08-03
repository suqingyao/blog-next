'use client';

import { useState } from 'react';
import { Skeleton } from './ui/skeleton';
import { cn } from '@/lib/utils';
import { useInView } from '@/hooks/use-in-view';

export type LazyImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  placeholder?: React.ReactNode;
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

  const alreadyLoaded = src && loadedSrcs?.has(src as string);
  const imgSrc = hasError ? fallbackSrc : src;

  return (
    <div
      ref={targetRef}
      className="relative"
    >
      {!(alreadyLoaded || isLoaded) && (
        <Skeleton
          type="image"
          width={width}
          height={height || 220}
          className="absolute inset-0 h-full w-full"
        />
      )}
      {(alreadyLoaded || isInView) && (
        <img
          className={cn(
            'object-cover transition-opacity duration-500 h-full w-full',
            isLoaded ? 'opacity-100' : 'opacity-0',
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
      )}
      {placeholder && !(alreadyLoaded || isInView) && placeholder}
    </div>
  );
};
