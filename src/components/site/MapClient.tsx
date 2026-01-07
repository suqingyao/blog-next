'use client';

import type { PhotoFile } from '@/lib/photos';
import dynamic from 'next/dynamic';

const PhotoMap = dynamic(() => import('./Map'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-zinc-800 rounded-xl">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>
  ),
});

export function MapClient({ photos }: { photos: PhotoFile[] }) {
  return <PhotoMap photos={photos} />;
}
