import Link from 'next/link';
import { LazyImage } from '@/components/lazy-image';
import { getAllAlbums } from '@/models/photo.model';

const PhotosPage = async () => {
  const albums = await getAllAlbums();
  return (
    <div className="flex flex-wrap gap-8">
      {albums.size === 0 && <div>暂无相册</div>}
      {Array.from(albums.keys()).map((album) => (
        <div key={album}>
          <h2 className="mb-3 text-lg font-semibold uppercase text-gray-800">
            {album}
          </h2>
          <div className="mx-auto max-w-5xl columns-1 gap-4 sm:columns-2 md:columns-3">
            {albums.get(album).map((img: string) => (
              <Link
                key={img}
                href={`/photos/${img}`}
                className="block p-4 text-lg font-semibold text-gray-800 no-underline"
              >
                <LazyImage
                  key={img}
                  src={`/api/photos/${img}`}
                  alt={img}
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
