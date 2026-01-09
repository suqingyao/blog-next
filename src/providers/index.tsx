'use client';

import type { PhotoManifest } from '@/types/photo';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { JotaiProvider } from './jotai-provider';
import { PhotosProvider } from './photos-provider';
import { ReactQueryProvider } from './react-query-provider';

export function AppProviders({ children, photos }: { children: React.ReactNode; photos: PhotoManifest[] }) {
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
