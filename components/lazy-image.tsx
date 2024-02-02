'use client';

import { useEffect, useState } from 'react';
import type { FC, ImgHTMLAttributes } from 'react';

import { ClientOnly } from './client-only';
import { Skeleton } from './skeleton';

import { cn } from '@/lib/utils';
import { useInView } from '@/hooks/use-in-view';

export type LazyImageProps = ImgHTMLAttributes<HTMLImageElement>;

export const LazyImage: FC<LazyImageProps> = (props) => {
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
        <Skeleton
          className="rounded-md"
          isLoaded={isLoaded}
        >
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
