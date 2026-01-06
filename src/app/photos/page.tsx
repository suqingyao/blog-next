import { PhotoList } from '@/components/site/PhotoList';
import { getPhotosFromAssets } from '@/lib/photos';

async function PhotosPage() {
  const photos = await getPhotosFromAssets();
  if (photos.length === 0) {
    return (
      <div className="content-container py-20 text-center text-muted-foreground">
        No photos found
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pb-20">
      <div className="mb-12 pt-10 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">Gallery</h1>
        <p className="text-muted-foreground">
          A collection of moments captured in time.
        </p>
      </div>
      <PhotoList photos={photos} />
    </div>
  );
}

export default PhotosPage;
