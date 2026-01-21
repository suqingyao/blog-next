'use client';

import { cn } from '@/lib/utils';

export default function PostTitle({
  className,
  title,
}: {
  className?: string;
  title: string;
}) {
  return (
    <h1
      className={cn(
        'post-title relative mb-5 flex items-center text-3xl font-extrabold',
        className,
      )}
    >
      <span>{title}</span>
    </h1>
  );
}
