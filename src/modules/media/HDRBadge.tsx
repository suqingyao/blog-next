import type { FC } from 'react';
import { cn } from '@/lib/utils';

export const HDRBadge: FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn(
        'absolute z-20 flex items-center space-x-1 rounded-xl bg-black/50 px-1 py-1 text-xs text-white',
        'top-12 lg:top-4 left-4',
        className,
      )}
    >
      <i className="i-mingcute-sun-line size-4" />
      <span className="mr-1">HDR</span>
    </div>
  );
};
