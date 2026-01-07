import { MapClient } from '@/components/site/MapClient';
import { getPhotosFromAssets } from '@/lib/photos';

export default async function MapPage() {
  const photos = await getPhotosFromAssets();

  return <MapClient photos={photos} />;
}
