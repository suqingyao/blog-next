import { MapClient } from '@/components/site/MapClient';
import { getPhotosFromAssets } from '@/lib/photos';

export default async function MapPage() {
  const photos = await getPhotosFromAssets();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Photo Map</h1>
        <p className="text-muted-foreground mt-2">
          Exploring the world through my lens.
        </p>
      </div>

      <div className="h-[calc(100vh-200px)] w-full overflow-hidden rounded-xl border border-border shadow-sm">
        <MapClient photos={photos} />
      </div>
    </div>
  );
}
