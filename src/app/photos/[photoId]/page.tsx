import { ClientOnly } from '@/components/common/ClientOnly';

import { photoLoader } from '@/lib/data';
import { PhotoViewerContent } from './_components/PhotoViewerContent';

export default function PhotoViewerPage() {
  return (
    <ClientOnly>
      <PhotoViewerContent />
    </ClientOnly>
  );
}

export async function generateStaticParams() {
  const photos = photoLoader.getPhotos();
  return photos.map(photo => ({ photoId: photo.id }));
}

export async function generateMetadata({ params }: { params: { photoId: string } }) {
  const { photoId } = await params;
  const photos = photoLoader.getPhotos();
  const photo = photos.find(p => p.id === photoId);

  if (!photo) {
    return {
      title: 'Photo Not Found',
    };
  }

  return {
    title: photo.title,
  };
}
