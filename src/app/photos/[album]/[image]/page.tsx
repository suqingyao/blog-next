import { OSS_URL_PREFIX } from '@/lib/constants';

interface Props {
  params: { album: string; image: string };
}

const PhotosAlbumPage = async ({ params }: Props) => {
  const imageUrl = `${OSS_URL_PREFIX}/${params.album}/${params.image}`;
  return (
    <>
      <img
        src={imageUrl}
        alt={params.image}
        className="w-full rounded-lg shadow-md transition-transform"
        loading="lazy"
      />
    </>
  );
};

export default PhotosAlbumPage;
