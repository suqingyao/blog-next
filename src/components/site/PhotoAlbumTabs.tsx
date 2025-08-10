'use client';

import type { PhotoFile } from '@/lib/photos';
import { memo, useState } from 'react';
import cityAlbums from '@/data/city-albums.json';
import { cn } from '@/lib/utils';

export const PhotoAlbumTabs = memo(
  ({
    photos,
    setCurrentAlbum,
  }: {
    photos: PhotoFile[];
    setCurrentAlbum: (album: string) => void;
  }) => {
    const albums = Array.from(new Set(photos.map(photo => photo.album)));
    const [current, setCurrent] = useState(albums[0]);

    return (
      <div className="my-4 flex flex-wrap gap-8">
        {albums.map(album => (
          <button
            key={album}
            onClick={() => {
              setCurrent(album);
              setCurrentAlbum(album);
            }}
            className={cn(
              'flex items-center gap-1 text-lg opacity-50 transition-opacity hover:opacity-100',
              current === album && 'opacity-100',
            )}
          >
            <i className="i-mingcute-hashtag-fill text-primary"></i>
            {' '}
            {cityAlbums[album as keyof typeof cityAlbums]?.zh_tw || album}
          </button>
        ))}
      </div>
    );
  },
);
