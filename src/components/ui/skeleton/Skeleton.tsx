import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

export const Skeleton = ({ className }: SkeletonProps) => {
  return (
    <div className={cn('flex animate-pulse flex-col gap-3', className)}>
      <div className="h-6 w-full rounded-lg bg-gray-200 dark:bg-zinc-800/80" />
      <div className="h-6 w-full rounded-lg bg-gray-200 dark:bg-zinc-800/80" />
      <div className="h-6 w-full rounded-lg bg-gray-200 dark:bg-zinc-800/80" />
      <div className="h-6 w-full rounded-lg bg-gray-200 dark:bg-zinc-800/80" />
      <span className="sr-only">Loading...</span>
    </div>
  );
};
