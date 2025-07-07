interface Props {
  params: { image: string };
}

const PhotosAlbumPage = async ({ params }: Props) => {
  const image = params.image;
  return (
    <>
      <img
        src={`/api/photos/${image}`}
        alt={image}
        className="w-full rounded-lg shadow-md transition-transform"
        loading="lazy"
      />
    </>
  );
};

export default PhotosAlbumPage;
