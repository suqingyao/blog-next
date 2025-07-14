import { PhotoList } from './_components/photo-list';
import { getPhotosFromAssets } from '@/lib/photos';

const PhotosPage = async () => {
  const photos = await getPhotosFromAssets();
  if (photos.length === 0) {
    return <div>暂无相册</div>;
  }

  return (
    <>
      <PhotoList photos={photos} />
    </>
  );
};

export default PhotosPage;
