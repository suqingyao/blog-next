'use client';

import { useEffect, useMemo, useState } from 'react';
import { RemoveScroll } from 'react-remove-scroll';
import { NotFound } from '@/components/common/NotFound';
import { RootPortal, RootPortalProvider } from '@/components/ui/portal';

import { useContextPhotos, usePhotoViewer } from '@/hooks/use-photo-viewer';
import { useTitle } from '@/hooks/use-title';
import { deriveAccentFromSources } from '@/lib/color';
import { cn } from '@/lib/utils';
import { PhotoViewer } from '@/modules/viewer';

export default function PhotoViewerPage() {
  const photoViewer = usePhotoViewer();
  const photos = useContextPhotos();

  const [ref, setRef] = useState<HTMLElement | null>(null);
  const rootPortalValue = useMemo(
    () => ({
      to: ref as HTMLElement,
    }),
    [ref],
  );
  useTitle(photos[photoViewer.currentIndex]?.title || 'Not Found');

  const [accentColor, setAccentColor] = useState<string | null>(null);

  useEffect(() => {
    const current = photos[photoViewer.currentIndex];
    if (!current)
      return;

    let isCancelled = false

    ;(async () => {
      try {
        const color = await deriveAccentFromSources({
          thumbHash: current.thumbHash,
          thumbnailUrl: current.thumbnailUrl,
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
  }, [photoViewer.currentIndex, photos]);

  if (!photos[photoViewer.currentIndex]) {
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
            onClose={photoViewer.closeViewer}
            onIndexChange={photoViewer.goToIndex}
          />
        </RemoveScroll>
      </RootPortalProvider>
    </RootPortal>
  );
}
