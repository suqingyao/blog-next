'use client';

import { ScrollArea, ScrollElementContext } from '@/components/ui/scroll-areas';
import { useMobile } from '@/hooks/use-mobile';
import { PhotosRoot } from '@/modules/gallery/PhotosRoot';

export default function PhotosPage() {
  const isMobile = useMobile();

  // Photos are now loaded client-side via PhotosProvider in RootLayout
  return (
    <div className="container mx-auto px-4 pb-20">
      {isMobile
        ? (
            <ScrollElementContext value={document.body}>
              <PhotosRoot />
            </ScrollElementContext>
          )
        : (
            <ScrollArea rootClassName="h-svh w-full" viewportClassName="size-full" scrollbarClassName="mt-12">
              <PhotosRoot />
            </ScrollArea>
          )}
    </div>
  );
}
