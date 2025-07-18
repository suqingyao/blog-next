import { cn } from '@/lib/utils';
import React, { Fragment } from 'react';

export type SkeletonType = 'rect' | 'circle' | 'text' | 'image';

interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
  type?: SkeletonType;
  count?: number;
  width?: number | string;
  height?: number | string;
  animated?: boolean;
}

export const Skeleton = ({
  className,
  children,
  type = 'rect',
  count = 1,
  width,
  height,
  animated = true
}: SkeletonProps) => {
  if (children) return <>{children}</>;

  const baseClass = cn(
    'bg-gray-200 dark:bg-zinc-800/80',
    animated && 'animate-pulse',
    type === 'circle' && 'rounded-full',
    type !== 'circle' && 'rounded-md',
    className
  );

  const style = {
    width,
    height
  };

  const getSkeleton = () => {
    switch (type) {
      case 'circle':
        return (
          <div
            className={cn(baseClass)}
            style={{ ...style, aspectRatio: '1/1' }}
          />
        );
      case 'text':
        return (
          <div
            className={cn(baseClass, 'mb-2 h-4 w-full last:mb-0')}
            style={style}
          />
        );
      case 'image':
        return (
          <div
            className={cn(baseClass, 'h-full w-full')}
            style={style}
          />
        );
      default:
        return (
          <div
            className={cn(baseClass, 'h-full')}
            style={style}
          />
        );
    }
  };

  return (
    <div
      aria-busy="true"
      aria-live="polite"
    >
      {Array.from({ length: count }).map((_, i) => (
        <React.Fragment key={i}>{getSkeleton()}</React.Fragment>
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
};
