import type { PhotoManifestItem } from '@/types/photo';
import { readFileSync } from 'node:fs';

import { join } from 'node:path';
import process from 'node:process';

class BuildTimePhotoLoader {
  private photos: PhotoManifestItem[] = [];
  private photoMap: Record<string, PhotoManifestItem> = {};

  constructor() {
    try {
      const manifestPath = join(process.cwd(), '../data/photos-manifest.json');
      const manifestContent = readFileSync(manifestPath, 'utf-8');
      this.photos = JSON.parse(manifestContent).data as PhotoManifestItem[];

      this.photos.forEach((photo) => {
        this.photoMap[photo.id] = photo;
      });

      console.info(`📚 Loaded ${this.photos.length} photos from manifest`);
    }
    catch (error) {
      console.error('❌ Failed to load photos manifest:', error);
      this.photos = [];
    }
  }

  getPhotos() {
    return this.photos;
  }

  getPhoto(id: string) {
    return this.photoMap[id];
  }
}

export const buildTimePhotoLoader = new BuildTimePhotoLoader();
