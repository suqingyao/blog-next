import { PhotoList } from '@/components/site/PhotoList';
import { getPhotosFromAssets } from '@/lib/photos';

const PhotosPage = async () => {
  const photos = await getPhotosFromAssets();
  if (photos.length === 0) {
    return <div>No photos found</div>;
  }

  return (
    <>
      <PhotoList photos={photos} />
    </>
  );
};

export default PhotosPage;
