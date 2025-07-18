'use client';

import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LazyImage } from '@/components/lazy-image';
import { MasonryX } from '@/components/masonry-x';
import { useModalRectAtom } from '@/hooks/use-modal-rect-atom';
import { PhotoFile } from '@/lib/photos';
import PhotoAlbumTabs from './photo-album-tabs';

interface PhotoItemProps {
  photo: string;
  album: string;
  onImgLoad: (height: number, src?: string) => void;
}

export const getOssImageId = (path: string) => {
  const parts = path.split('/');
  return parts[parts.length - 1];
};

function PhotoItem({
  photo,
  album,
  onImgLoad,
  width,
  height
}: PhotoItemProps & { width?: number; height?: number }) {
  const router = useRouter();
  const { setModalRectAtom } = useModalRectAtom();

  return (
    <LazyImage
      src={`/photos/${photo}`}
      alt={photo}
      className="w-full cursor-pointer rounded-sm"
      width={width}
      height={height}
      onLoad={(e) => {
        const img = e.target as HTMLImageElement;
        const h =
          (img.naturalHeight * (width || img.width)) / (img.naturalWidth || 1);
        onImgLoad(h, photo);
      }}
      onClick={(e: React.MouseEvent<HTMLImageElement>) => {
        const rect = (e.target as HTMLImageElement).getBoundingClientRect();
        if (rect) {
          setModalRectAtom({
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height,
            scrollY: window.scrollY
          });
        }
        router.push(`/photos/${album}/${getOssImageId(photo)}`);
      }}
    />
  );
}

export const PhotoList = ({ photos }: { photos: PhotoFile[] }) => {
  const [currentAlbum, setCurrentAlbum] = useState(photos[0].album);
  const [columnCount, setColumnCount] = useState(3);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleResize() {
      const width = containerRef.current?.clientWidth;
      if (!width) return;
      if (width >= 1440) setColumnCount(6); // 2xl
      else if (width >= 1280) setColumnCount(5); // xl
      else if (width >= 1024) setColumnCount(4); // lg
      else if (width >= 768) setColumnCount(3); // sm/md
      else setColumnCount(2); // xs
    }

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [containerRef.current?.clientWidth]);

  return (
    <div ref={containerRef}>
      <PhotoAlbumTabs
        photos={photos}
        setCurrentAlbum={setCurrentAlbum}
      />
      {currentAlbum && (
        <MasonryX
          items={photos
            .filter((photo) => photo.album === currentAlbum)
            .map((photo) => photo.url)}
          columnCount={columnCount}
          gap={16}
          enableVirtualScroll={false}
          getItemHeight={(photo, idx) => {
            return 300;
          }}
          renderItem={(photo, idx, onImgLoad, width, height) => (
            <PhotoItem
              key={photo}
              photo={photo}
              album={currentAlbum}
              onImgLoad={onImgLoad}
              width={width}
              height={height}
            />
          )}
        />
      )}
    </div>
  );
};
