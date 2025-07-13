'use client';

import { useRef, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { LazyImage } from '@/components/lazy-image';
import { MasonryX } from '@/components/masonry-x';
import { useModalRectAtom } from '@/hooks/use-modal-rect-atom';
import cityAlbums from '@/data/city-albums.json';

interface PhotoListProps {
  photos: Map<string, string[]>;
}

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
  const containerRef = useRef<HTMLDivElement>(null);
  const { setModalRectAtom } = useModalRectAtom();

  return (
    <div
      ref={containerRef}
      className="w-full"
    >
      <LazyImage
        src={photo}
        alt={photo}
        className="w-full cursor-pointer rounded-sm"
        width={width}
        height={height}
        onLoad={(e) => {
          const img = e.target as HTMLImageElement;
          const h =
            (img.naturalHeight * (width || img.width)) /
            (img.naturalWidth || 1);
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
    </div>
  );
}

export const PhotoList = ({ photos }: PhotoListProps) => {
  return (
    <>
      {Array.from(photos.keys()).map((album: string) => (
        <Fragment key={album}>
          <h2 className="mb-3 text-lg font-semibold uppercase text-gray-800">
            {cityAlbums[album as keyof typeof cityAlbums]?.zh_tw || album}
          </h2>
          <MasonryX
            items={photos.get(album) || []}
            columnCount={3}
            gap={16}
            getItemHeight={(photo, idx) => {
              return 200;
            }}
            renderItem={(photo, idx, onImgLoad, width, height) => (
              <PhotoItem
                key={photo}
                photo={photo}
                album={album}
                onImgLoad={onImgLoad}
                width={width}
                height={height}
              />
            )}
          />
        </Fragment>
      ))}
    </>
  );
};
