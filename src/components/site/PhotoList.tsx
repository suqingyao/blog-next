'use client';

import type { Item } from '@/components/ui/masonry';
import { AnimatePresence, motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useMemo, useRef, useState } from 'react';
import { Masonry } from '@/components/ui/masonry';
import { getPhotoId } from '@/lib/photo-util';
import { usePhotos } from '@/providers/photos-provider';
import { useModalRectAtom } from '@/store/hooks/use-modal-rect-atom';
import { PhotoAlbumTabs } from './PhotoAlbumTabs';

export function PhotoList() {
  // Now using photos from context which are PhotoManifest[] (afilmory style)
  const photos = usePhotos(); 
  const [currentAlbum, setCurrentAlbum] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);
  const { setModalRectAtom } = useModalRectAtom();
  const router = useRouter();

  // Initialize currentAlbum once photos are loaded
  useMemo(() => {
    if (photos.length > 0 && !currentAlbum && photos[0].album) {
      setCurrentAlbum(photos[0].album);
    }
  }, [photos, currentAlbum]);

  // Transform photos into simple structure for tabs
  const photoFiles = useMemo(() => {
    return photos
      .filter(p => p.album) // Ensure album exists
      .map(p => ({
        album: p.album!,
        absUrl: p.originalUrl,
      }));
  }, [photos]);

  const filteredPhotos = useMemo(() => {
    return photos
      .filter(p => p.album === currentAlbum)
      .map(p => ({
        id: p.id,
        img: p.originalUrl,
        url: p.originalUrl,
        width: p.width,
        height: p.height,
        blurhash: p.blurhash,
        blurDataURL: p.blurhash || undefined, // Masonry might expect this name or handle blurhash
      }));
  }, [photos, currentAlbum]);

  function handleItemClick(item: Item, e: React.MouseEvent) {
    const rect = e.currentTarget.getBoundingClientRect();
    setModalRectAtom({
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    });

    const photoId = getPhotoId(item.url);
    router.push(`/photos/${photoId}?url=${encodeURIComponent(item.url)}`);
  }

  // Loading state handled by parent or empty check
  if (photos.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div ref={containerRef}>
      <PhotoAlbumTabs
        photos={photoFiles}
        setCurrentAlbum={setCurrentAlbum}
      />
      <AnimatePresence mode="wait">
        {currentAlbum && (
          <motion.div
            key={currentAlbum}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Masonry
              items={filteredPhotos}
              scaleOnHover={true}
              colorShiftOnHover={true}
              onItemClick={handleItemClick}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
