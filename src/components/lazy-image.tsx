'use client';

import { useEffect, useState } from 'react';
import type { ImgHTMLAttributes } from 'react';

import { ClientOnly } from './common/client-only';
import { Skeleton } from './ui/skeleton';

import { cn } from '@/lib/utils';
import { useInView } from '@/hooks/use-in-view';

export type LazyImageProps = ImgHTMLAttributes<HTMLImageElement>;

export const LazyImage = (props: LazyImageProps) => {
  const { className, src, ...rest } = props;

  const [visible, setVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const [targetRef, isInView] = useInView({
    triggerOnce: true
  });

  useEffect(() => {
    if (isInView) {
      setVisible(true);
    }
  }, [isInView]);

  return (
    <ClientOnly>
      <span ref={targetRef}>
        <Skeleton className="rounded-md">
          {visible && (
            <img
              className={cn(
                'w-full rounded-md object-cover opacity-0 transition-opacity',
                isLoaded && 'opacity-100',
                className
              )}
              onLoad={() => setIsLoaded(true)}
              src={src}
              {...rest}
              alt="og"
            />
          )}
        </Skeleton>
      </span>
    </ClientOnly>
  );
};
