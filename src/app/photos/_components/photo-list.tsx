'use client';

import { LazyImage } from '@/components/lazy-image';
import { MasonryX } from '@/components/masonry-x';
import { useModalRectAtom } from '@/hooks/use-modal-rect-atom';
import { useRouter } from 'next/navigation';
import { useRef, Fragment } from 'react';

interface PhotoListProps {
  photos: Map<string, string[]>;
}

interface PhotoItemProps {
  photo: string;
  album: string;
  onImgLoad: (height: number) => void;
}

export const getOssImageId = (path: string) => {
  const parts = path.split('/');
  return parts[parts.length - 1];
};

function PhotoItem({ photo, album, onImgLoad }: PhotoItemProps) {
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
        onLoad={(e) => {
          const img = e.target as HTMLImageElement;
          const width = containerRef.current?.clientWidth || img.width;
          const h = img.naturalHeight * (width / img.naturalWidth);
          onImgLoad(h);
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
            {album}
          </h2>
          <MasonryX
            items={photos.get(album) || []}
            columnCount={3}
            gap={16}
            renderItem={(photo, idx, onImgLoad) => (
              <PhotoItem
                key={photo}
                photo={photo}
                album={album}
                onImgLoad={onImgLoad}
              />
            )}
          />
        </Fragment>
      ))}
    </>
  );
};
