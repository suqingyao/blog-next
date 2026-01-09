import { createContext, useContext } from 'react'

import type { PhotoManifest } from '@/types/photo'

export const PhotosContext = createContext<PhotoManifest[]>(null!)

export const PhotosProvider = ({ children, photos }: { children: React.ReactNode; photos: PhotoManifest[] }) => {
  return <PhotosContext value={photos}>{children}</PhotosContext>
}

export const usePhotos = () => {
  const context = useContext(PhotosContext)
  if (context === undefined) {
    throw new Error('usePhotos must be used within a PhotosProvider')
  }
  return context
}
