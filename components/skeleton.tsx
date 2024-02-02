import type { PropsWithChildren } from 'react';

import { cn } from '@/lib/utils';

export type SkeletonProps = PropsWithChildren<{
  isLoaded?: boolean;
  className?: string;
  children?: React.ReactNode;
}>;

export const Skeleton = (props: SkeletonProps) => {
  const { isLoaded = false, className, children } = props;

  return (
    <span
      className={cn(
        'block h-fit animate-skeleton-loading bg-gradient-to-r from-skeleton-color via-skeleton-to-color to-skeleton-color bg-[400%,100%]',
        isLoaded && 'animate-none bg-transparent',
        className
      )}
    >
      {children}
    </span>
  );
};
