import { PhotoList } from '@/components/site/PhotoList';

async function PhotosPage() {
  // Photos are now loaded client-side via PhotosProvider in RootLayout
  return (
    <div className="container mx-auto px-4 pb-20">
      <div className="mb-12 pt-10 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">Gallery</h1>
        <p className="text-muted-foreground">
          A collection of moments captured in time.
        </p>
      </div>
      <PhotoList />
    </div>
  );
}

export default PhotosPage;
