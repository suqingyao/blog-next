'use client';

import { useRef, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useModalRectAtom } from '@/hooks/use-modal-rect-atom';
import { PhotoAlbumTabs } from './photo-album-tabs';
import { type Item, Masonry } from '@/components/ui/masonry';
import { type PhotoFile } from '@/lib/photos';

export const PhotoList = ({ photos }: { photos: PhotoFile[] }) => {
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
      map.get(photo.album)!.push(photo.url);
    });
    return map;
  }, [photos]);

  // 使用 useMemo 缓存当前相册的照片列表
  const filteredPhotos = useMemo(() => {
    return (albumPhotosMap.get(currentAlbum) || []).map((photo) => ({
      id: photo,
      img: `/photos/${photo}`,
      url: `/photos/${photo}`
    }));
  }, [albumPhotosMap, currentAlbum]);

  function handleItemClick(item: Item, e: React.MouseEvent<HTMLImageElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    setModalRectAtom({
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY,
      width: rect.width,
      height: rect.height
    });

    router.push(`/photos/${item.id}`);
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
          hoverScale={0.95}
          colorShiftOnHover={false}
          onItemClick={handleItemClick}
        />
      )}
    </div>
  );
};
