import type { PhotoManifest } from '@/types/photo';

import { createContext } from 'react';

export const PhotosContext = createContext<PhotoManifest[]>(null!);

export function PhotosProvider({ children, photos }: { children: React.ReactNode; photos: PhotoManifest[] }) {
  return <PhotosContext.Provider value={photos}>{children}</PhotosContext.Provider>;
}
