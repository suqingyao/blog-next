import type { PhotoManifestItem } from '@/types/photo'

// Since we don't have __MANIFEST__ global injection, we simulate loading it.
// In afilmory, this class wraps the manifest. Here we'll allow initializing it with data.

class PhotoLoader {
  private photos: PhotoManifestItem[] = []
  private photoMap: Record<string, PhotoManifestItem> = {}
  private initialized = false

  constructor() {
    this.getAllTags = this.getAllTags.bind(this)
    this.getPhotos = this.getPhotos.bind(this)
    this.getPhoto = this.getPhoto.bind(this)
  }

  // Initialize with data (called from RootLayout or similar)
  init(data: PhotoManifestItem[]) {
    if (this.initialized) return
    this.photos = data
    this.photos.forEach((photo) => {
      this.photoMap[photo.id] = photo
    })
    this.initialized = true
  }

  getPhotos() {
    return this.photos
  }

  getPhoto(id: string) {
    return this.photoMap[id]
  }

  getAllTags() {
    const tagSet = new Set<string>()
    this.photos.forEach((photo) => {
      photo.tags.forEach((tag) => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  }
}

export const photoLoader = new PhotoLoader()

// Helper to fetch data (not in afilmory but needed for Next.js setup)
export async function fetchManifest(): Promise<PhotoManifestItem[]> {
  try {
    if (typeof window === 'undefined') {
      const { promises: fs } = await import('node:fs');
      const { join } = await import('node:path');
      const process = await import('node:process');
      const manifestPath = join(process.cwd(), 'public/image-metadata.json');
      const content = await fs.readFile(manifestPath, 'utf-8');
      return JSON.parse(content);
    } else {
      const res = await fetch('/image-metadata.json');
      if (!res.ok) throw new Error('Failed to load manifest');
      return await res.json();
    }
  } catch (e) {
    console.error('Failed to load photo manifest', e);
    return [];
  }
}
