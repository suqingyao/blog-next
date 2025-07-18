import Image from 'next/image';

const PhotosAlbumPage = async ({ params }: { params: { album: string; image: string } }) => {
  const { album, image } = await params;
  const imageUrl = `/photos/${album}/${image}`;
  return (
    <>
      <Image
        src={imageUrl}
        alt={image}
        className="w-full rounded-lg shadow-md transition-transform"
        loading="lazy"
      />
    </>
  );
};

export default PhotosAlbumPage;
