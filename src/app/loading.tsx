'use client';

import { GooeyLoading } from '@/components/ui/gooey-loading';

export default function Loading() {
  return (
    <div className="flex h-[50vh] w-full items-center justify-center overflow-hidden">
      <GooeyLoading />
    </div>
  );
}
