'use client';

import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { usePhotos } from '@/hooks/use-photo-viewer';
import { JotaiProvider } from './jotai-provider';
import { PhotosProvider } from './photos-provider';
import { ReactQueryProvider } from './react-query-provider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  const photos = usePhotos();
  return (
    <ReactQueryProvider>
      <JotaiProvider>
        <PhotosProvider photos={photos}>
          <NextThemeProvider
            attribute="class"
            storageKey="blog-theme"
            defaultTheme="light"
          >
            {children}
          </NextThemeProvider>
        </PhotosProvider>
      </JotaiProvider>
    </ReactQueryProvider>
  );
}
