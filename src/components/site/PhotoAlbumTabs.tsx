'use client';

import type { PhotoFile } from '@/lib/photos';
import { motion } from 'motion/react';
import { memo, useMemo, useState } from 'react';
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
    // 统计每个相册的照片数量
    const albums = useMemo(() => {
      const albumCounts = new Map<string, number>();
      photos.forEach((photo) => {
        albumCounts.set(photo.album, (albumCounts.get(photo.album) || 0) + 1);
      });
      return Array.from(albumCounts.entries()).map(([name, count]) => ({
        name,
        count,
        displayName: cityAlbums[name as keyof typeof cityAlbums]?.zh_tw || name,
      }));
    }, [photos]);

    const [current, setCurrent] = useState(albums[0]?.name);

    if (!albums.length) return null;

    return (
      <div className="mb-10 w-full overflow-hidden">
        <div className="no-scrollbar flex w-full gap-3 overflow-x-auto px-4 pb-4">
          <div className="mx-auto flex gap-3">
            {albums.map(album => (
              <motion.button
                key={album.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setCurrent(album.name);
                  setCurrentAlbum(album.name);
                }}
                className={cn(
                  'group relative flex shrink-0 items-center rounded-full px-5 py-2.5 text-sm font-medium transition-colors whitespace-nowrap',
                  current === album.name
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                    : 'bg-secondary/50 text-secondary-foreground hover:bg-secondary',
                )}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span className="uppercase tracking-wide">{album.displayName}</span>
                  <span
                    className={cn(
                      'flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-[10px] font-bold',
                      current === album.name
                        ? 'bg-primary-foreground/20 text-primary-foreground'
                        : 'bg-primary/10 text-primary group-hover:bg-primary/20',
                    )}
                  >
                    {album.count}
                  </span>
                </span>
                {current === album.name && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-full bg-primary"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  },
);
