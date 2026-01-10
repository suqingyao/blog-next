'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { RemoveScroll } from 'react-remove-scroll';
import { NotFound } from '@/components/common/NotFound';
import { RootPortal, RootPortalProvider } from '@/components/ui/portal';

import { useContextPhotos, usePhotoViewer } from '@/hooks/use-photo-viewer';
import { useTitle } from '@/hooks/use-title';
import { deriveAccentFromSources } from '@/lib/color';
import { cn } from '@/lib/utils';
import { PhotoViewer } from '@/modules/viewer';

export default function PhotoModalPage() {
  const params = useParams();
  const router = useRouter();
  const photoViewer = usePhotoViewer();
  const photos = useContextPhotos();

  const photoId = params.photoId as string;

  // Find photo index and open viewer when photoId changes
  useEffect(() => {
    if (photoId) {
      const targetIndex = photos.findIndex(photo => photo.id === photoId);
      if (targetIndex !== -1 && !photoViewer.isOpen) {
        photoViewer.openViewer(targetIndex);
      }
    }
  }, [photoId, photos, photoViewer]);

  const [ref, setRef] = useState<HTMLElement | null>(null);
  const rootPortalValue = useMemo(
    () => ({
      to: ref as HTMLElement,
    }),
    [ref],
  );

  const currentPhoto = photos[photoViewer.currentIndex];
  useTitle(currentPhoto?.title || 'Not Found');

  const [accentColor, setAccentColor] = useState<string | null>(null);

  useEffect(() => {
    if (!currentPhoto)
      return;

    let isCancelled = false;

    (async () => {
      try {
        const color = await deriveAccentFromSources({
          thumbHash: currentPhoto.thumbHash,
          thumbnailUrl: currentPhoto.thumbnailUrl,
        });
        if (!isCancelled) {
          const $css = document.createElement('style');
          $css.textContent = `
         * {
             transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out;
            }
          `;
          document.head.append($css);

          setTimeout(() => {
            $css.remove();
          }, 100);

          setAccentColor(color ?? null);
        }
      }
      catch {
        if (!isCancelled)
          setAccentColor(null);
      }
    })();

    return () => {
      isCancelled = true;
    };
  }, [currentPhoto]);

  // Handle close - navigate back to /photos
  const handleClose = () => {
    photoViewer.closeViewer();
    router.push('/photos');
  };

  // Handle index change - update URL
  const handleIndexChange = (newIndex: number) => {
    photoViewer.goToIndex(newIndex);
    const newPhoto = photos[newIndex];
    if (newPhoto) {
      router.push(`/photos/${newPhoto.id}`, { scroll: false });
    }
  };

  if (!currentPhoto) {
    return <NotFound />;
  }

  return (
    <RootPortal>
      <RootPortalProvider value={rootPortalValue}>
        <RemoveScroll
          style={
            {
              ...(accentColor ? { '--color-accent': accentColor } : {}),
            } as React.CSSProperties
          }
          ref={setRef}
          className={cn(photoViewer.isOpen ? 'fixed inset-0 z-9999' : 'pointer-events-none fixed inset-0 z-40')}
        >
          <PhotoViewer
            photos={photos}
            currentIndex={photoViewer.currentIndex}
            isOpen={photoViewer.isOpen}
            triggerElement={photoViewer.triggerElement}
            onClose={handleClose}
            onIndexChange={handleIndexChange}
          />
        </RemoveScroll>
      </RootPortalProvider>
    </RootPortal>
  );
}
