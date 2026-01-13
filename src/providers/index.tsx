'use client';

import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { ModalContainer } from '@/components/ui/modal';
import { usePhotos } from '@/hooks/use-photo-viewer';
import { ContextMenuProvider } from './context-menu-provider';
import { EventProvider } from './event-provider';
import { JotaiProvider } from './jotai-provider';
import { MotionProvider } from './motion-provider';
import { PhotosProvider } from './photos-provider';
import { ReactQueryProvider } from './react-query-provider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  const photos = usePhotos();
  return (
    <MotionProvider>
      <JotaiProvider>
        <ReactQueryProvider>
          <PhotosProvider photos={photos}>
            <NextThemeProvider
              attribute="class"
              storageKey="blog-theme"
              defaultTheme="light"
            >
              <ContextMenuProvider />
              <EventProvider />
              <ModalContainer />
              <Toaster />
              {children}
            </NextThemeProvider>
          </PhotosProvider>
        </ReactQueryProvider>
      </JotaiProvider>
    </MotionProvider>
  );
}
