'use client';

import { useParams, useSearchParams } from 'next/navigation';

const PhotosAlbumPage = () => {
  const { image } = useParams();
  const searchParams = useSearchParams();
  const url = searchParams.get('url') || '';
  const imageUrl = decodeURIComponent(url);

  return (
    <div className="h-[calc(100vh-theme(spacing.header)-theme(spacing.footer))] flex items-center justify-center py-5">
      <img
        src={imageUrl}
        alt={image as string}
        className="h-full rounded-lg object-cover"
        loading="lazy"
      />
    </div>
  );
};

export default PhotosAlbumPage;
