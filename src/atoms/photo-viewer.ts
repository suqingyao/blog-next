import type { PhotoManifest } from '@/types/photo';
import { atom } from 'jotai';

import { createAtomHooks } from '@/lib/jotai';

interface PhotoViewerState {
  photos: PhotoManifest[];
  currentIndex: number;
  isOpen: boolean;
  triggerElement: HTMLElement | null;
}

export const [photoViewerAtom, usePhotoViewerState, usePhotoViewerValue, useSetPhotoViewer] = createAtomHooks(atom<PhotoViewerState>({
  photos: [],
  currentIndex: 0,
  isOpen: false,
  triggerElement: null,
}));
