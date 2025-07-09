import Link from 'next/link';
import { LazyImage } from '@/components/lazy-image';
import { getOssImageId, getOssPhotos } from '@/lib/oss';

const PhotosPage = async () => {
  const photos = await getOssPhotos();

  if (photos.size === 0) {
    return <div>暂无相册</div>;
  }

  return (
    <div className="flex flex-wrap gap-8">
      {Array.from(photos.keys()).map((album) => (
        <div key={album}>
          <h2 className="mb-3 text-lg font-semibold uppercase text-gray-800">
            {album}
          </h2>
          <div className="mx-auto max-w-5xl columns-1 gap-4 sm:columns-2 md:columns-3">
            {photos.get(album)?.map((imgUrl: string) => (
              <Link
                key={imgUrl}
                href={`/photos/${album}/${getOssImageId(imgUrl)}`}
                className="block text-lg font-semibold text-gray-800 no-underline"
              >
                <LazyImage
                  key={imgUrl}
                  src={imgUrl}
                  alt={imgUrl}
                  className="mb-4 w-full rounded-sm"
                />
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PhotosPage;
