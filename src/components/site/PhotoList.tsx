'use client';

import type { Item } from '@/components/ui/masonry';
import type { PhotoFile } from '@/lib/photos';
import { useRouter } from 'next/navigation';
import { useMemo, useRef, useState } from 'react';
import { Masonry } from '@/components/ui/masonry';
import { getPhotoId } from '@/lib/photo-util';
import { useModalRectAtom } from '@/store/hooks/use-modal-rect-atom';
import { PhotoAlbumTabs } from './PhotoAlbumTabs';

export function PhotoList({ photos }: { photos: PhotoFile[] }) {
  const [currentAlbum, setCurrentAlbum] = useState(photos[0].album);
  const containerRef = useRef<HTMLDivElement>(null);
  const { setModalRectAtom } = useModalRectAtom();
  const router = useRouter();
  // 使用 useMemo 缓存所有相册的照片列表，避免重复过滤
  const albumPhotosMap = useMemo(() => {
    const map = new Map<string, string[]>();
    photos.forEach((photo) => {
      if (!map.has(photo.album)) {
        map.set(photo.album, []);
      }
      map.get(photo.album)!.push(photo.absUrl);
    });
    return map;
  }, [photos]);

  // 使用 useMemo 缓存当前相册的照片列表
  const filteredPhotos = useMemo(() => {
    return (albumPhotosMap.get(currentAlbum) || []).map(photo => ({
      id: photo,
      img: photo,
      url: photo,
    }));
  }, [albumPhotosMap, currentAlbum]);

  function handleItemClick(item: Item, e: React.MouseEvent) {
    const rect = e.currentTarget.getBoundingClientRect();
    setModalRectAtom({
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    });

    const photo = getPhotoId(item.url);
    router.push(`/photos/${photo}?url=${encodeURIComponent(item.url)}`);
  }

  return (
    <div ref={containerRef}>
      <PhotoAlbumTabs
        photos={photos}
        setCurrentAlbum={setCurrentAlbum}
      />
      {currentAlbum && (
        <Masonry
          items={filteredPhotos}
          scaleOnHover={true}
          colorShiftOnHover={true}
          onItemClick={handleItemClick}
        />
      )}
    </div>
  );
}
