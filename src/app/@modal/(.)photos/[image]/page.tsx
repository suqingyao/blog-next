import { PhotoModal } from './PhotoModal';
import { photoUrlParser } from '@/lib/photo-util';

interface PhotosModalPageProps {
  params: { image: string };
  searchParams: { url?: string };
}

export default async function PhotosModalPage({
  params,
  searchParams
}: PhotosModalPageProps) {
  const { image } = await params;
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
