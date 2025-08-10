import { PhotoList } from '@/components/site/PhotoList';
import { getPhotosFromAssets } from '@/lib/photos';

async function PhotosPage() {
  const photos = await getPhotosFromAssets();
  if (photos.length === 0) {
    return <div>No photos found</div>;
  }

  return (
    <div className="container">
      <PhotoList photos={photos} />
    </div>
  );
}

export default PhotosPage;
