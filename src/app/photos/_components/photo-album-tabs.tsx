'use client';

import { cn } from '@/lib/utils';
import { useState, memo } from 'react';
import cityAlbums from '@/data/city-albums.json';
import { PhotoFile } from '@/lib/photos';

const PhotoAlbumTabs = memo(
  ({
    photos,
    setCurrentAlbum
  }: {
    photos: PhotoFile[];
    setCurrentAlbum: (album: string) => void;
  }) => {
    const albums = Array.from(new Set(photos.map((photo) => photo.album)));
    const [current, setCurrent] = useState(albums[0]);

    return (
      <div className="my-4 flex flex-wrap gap-8">
        {albums.map((album) => (
          <button
            key={album}
            onClick={() => {
              setCurrent(album);
              setCurrentAlbum(album);
            }}
            className={cn(
              'rounded-md text-2xl opacity-50 transition-opacity hover:opacity-100',
              current === album && 'opacity-100'
            )}
          >
            {cityAlbums[album as keyof typeof cityAlbums]?.zh_tw || album}
          </button>
        ))}
      </div>
    );
  }
);

export default PhotoAlbumTabs;
