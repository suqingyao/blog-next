import { photoUrlParser } from '@/lib/photo-util';
import { PhotoModal } from './PhotoModal';

interface PhotosModalPageProps {
  params: { image: string };
  searchParams: { url?: string };
}

export default async function PhotosModalPage({
  searchParams,
}: PhotosModalPageProps) {
  const resolvedSearchParams = await searchParams;
  const url = resolvedSearchParams.url
    ? decodeURIComponent(resolvedSearchParams.url)
    : '';

  const photo = photoUrlParser(url);

  return (
    <>
      <PhotoModal photo={photo} />
    </>
  );
}
