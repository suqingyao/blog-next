/**
 * Photo data loader - Client-side version
 * Compatible with @afilmory/data API
 *
 * This module provides photo data access for client-side React components.
 * It uses a dynamically imported manifest that is bundled at build time.
 *
 * NOTE: This is a bridge module that provides the same API as afilmory's @afilmory/data
 * but uses our local manifest generation system.
 */

import type { CameraInfo, LensInfo } from '@/types/manifest';
import type { PhotoManifestItem } from '@/types/photo';

// Dynamic import of the manifest data
// During build, Next.js will bundle this JSON into the client bundle
import manifestData from '../../photos-manifest.json' with { type: 'json' };

class PhotoLoader {
  private photos: PhotoManifestItem[];
  private photoMap: Record<string, PhotoManifestItem>;
  private cameras: CameraInfo[];
  private lenses: LensInfo[];

  constructor() {
    this.getAllTags = this.getAllTags.bind(this);
    this.getAllCameras = this.getAllCameras.bind(this);
    this.getAllLenses = this.getAllLenses.bind(this);
    this.getPhotos = this.getPhotos.bind(this);
    this.getPhoto = this.getPhoto.bind(this);

    // Load manifest data synchronously from the imported JSON
    this.photos = (manifestData.data || []) as unknown as PhotoManifestItem[];
    this.cameras = (manifestData.cameras || []) as unknown as CameraInfo[];
    this.lenses = (manifestData.lenses || []) as unknown as LensInfo[];

    // Build photo map for fast lookup
    this.photoMap = {};
    this.photos.forEach((photo) => {
      this.photoMap[photo.id] = photo;
    });

    if (typeof window !== 'undefined') {
      console.info(`📚 Loaded ${this.photos.length} photos from manifest`);
    }
  }

  getPhotos() {
    return this.photos;
  }

  getPhoto(id: string) {
    return this.photoMap[id];
  }

  getAllTags() {
    const tagSet = new Set<string>();
    this.photos.forEach((photo) => {
      photo.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }

  getAllCameras() {
    return this.cameras;
  }

  getAllLenses() {
    return this.lenses;
  }
}

// Export singleton instance (compatible with afilmory's API)
export const photoLoader = new PhotoLoader();
