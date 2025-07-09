import { getOssPhotos } from '@/lib/oss';
import { PhotoList } from './_components/photo-list';

const PhotosPage = async () => {
  const photos = await getOssPhotos();

  if (photos.size === 0) {
    return <div>暂无相册</div>;
  }

  return <PhotoList photos={photos} />;
};

export default PhotosPage;
