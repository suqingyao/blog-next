'use client';

import { useEffect } from 'react';

import { useHash } from '@/hooks/use-hash';
import { cn, scrollTo } from '@/lib/utils';
import { APP_HEADER_HEIGHT } from '@/constants';

export const MarkdownContentContainer = ({
  className,
  onScroll,
  onMouseEnter,
  children
}: {
  className?: string;
  onScroll?: (scrollTop: number) => void;
  onMouseEnter?: () => void;
  children?: JSX.Element;
}) => {
  const hash = useHash();
  useEffect(() => {
    scrollTo(hash, false, APP_HEADER_HEIGHT);
  }, [hash]);

  return (
    <div
      className={cn('relative', className)}
      onMouseEnter={onMouseEnter}
      onScroll={(e) => onScroll?.((e.target as any)?.scrollTop)}
    >
      {children}
    </div>
  );
};
