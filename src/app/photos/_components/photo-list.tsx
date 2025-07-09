'use client';

import { LazyImage } from '@/components/lazy-image';
import { MasonryX } from '@/components/masonry-x';
import Link from 'next/link';
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
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="w-full"
    >
      <Link href={`/photos/${album}/${getOssImageId(photo)}`}>
        <LazyImage
          src={photo}
          alt={photo}
          className="w-full rounded-sm"
          onLoad={(e) => {
            const img = e.target as HTMLImageElement;
            const width = containerRef.current?.clientWidth || img.width;
            const h = img.naturalHeight * (width / img.naturalWidth);
            onImgLoad(h);
          }}
        />
      </Link>
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
