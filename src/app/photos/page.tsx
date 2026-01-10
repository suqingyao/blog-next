'use client';

import { useAtomValue, useSetAtom } from 'jotai';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { ScrollArea, ScrollElementContext } from '@/components/ui/scroll-areas';
import { useMobile } from '@/hooks/use-mobile';
import { PhotosRoot } from '@/modules/gallery/PhotosRoot';
import { gallerySettingAtom } from '@/store/atoms/app';

export default function PhotosPage() {
  useStateRestoreFromUrl();
  useSyncStateToUrl();
  const isMobile = useMobile();

  // Photos are now loaded client-side via PhotosProvider in RootLayout
  return (
    <>
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
    </>
  );
}

let isRestored = false;

// Unified hook to sync URL to state
// This runs in the photos page layout and handles all URL → state synchronization
function useStateRestoreFromUrl() {
  const triggerOnceRef = useRef(false);
  const setGallerySetting = useSetAtom(gallerySettingAtom);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (triggerOnceRef.current)
      return;
    triggerOnceRef.current = true;
    isRestored = true;

    // Restore filter settings from URL
    const tagsFromSearchParams = searchParams.get('tags')?.split(',');
    const camerasFromSearchParams = searchParams.get('cameras')?.split(',');
    const lensesFromSearchParams = searchParams.get('lenses')?.split(',');
    const ratingsFromSearchParams = searchParams.get('rating') ? Number(searchParams.get('rating')) : null;
    const tagModeFromSearchParams = searchParams.get('tag_mode') as 'union' | 'intersection' | null;

    if (
      tagsFromSearchParams
      || camerasFromSearchParams
      || lensesFromSearchParams
      || ratingsFromSearchParams !== null
      || tagModeFromSearchParams
    ) {
      setGallerySetting(prev => ({
        ...prev,
        selectedTags: tagsFromSearchParams || prev.selectedTags,
        selectedCameras: camerasFromSearchParams || prev.selectedCameras,
        selectedLenses: lensesFromSearchParams || prev.selectedLenses,
        selectedRatings: ratingsFromSearchParams ?? prev.selectedRatings,
        tagFilterMode: tagModeFromSearchParams || prev.tagFilterMode,
      }));
    }

    // Note: photoId sync is handled by individual photo pages (Modal and standalone)
    // This avoids conflict between different route handlers
  }, [searchParams, setGallerySetting]);
}

// Simplified function to only sync filter params (tags, cameras, etc.) to URL
// Photo navigation is now handled by Next.js routing and @modal slot
function useSyncStateToUrl() {
  const { selectedTags, selectedCameras, selectedLenses, selectedRatings, tagFilterMode }
    = useAtomValue(gallerySettingAtom);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isRestored)
      return;

    const tags = selectedTags.join(',');
    const cameras = selectedCameras.join(',');
    const lenses = selectedLenses.join(',');
    const rating = selectedRatings?.toString() ?? '';
    const tagMode = tagFilterMode === 'union' ? '' : tagFilterMode;

    const currentTags = searchParams.get('tags');
    const currentCameras = searchParams.get('cameras');
    const currentLenses = searchParams.get('lenses');
    const currentRating = searchParams.get('rating');
    const currentTagMode = searchParams.get('tag_mode');

    if (currentTags === tags
      && currentCameras === cameras
      && currentLenses === lenses
      && currentRating === rating
      && currentTagMode === tagMode) {
      return;
    }

    const newer = new URLSearchParams(searchParams.toString());

    // Update tags
    if (tags) {
      newer.set('tags', tags);
    }
    else {
      newer.delete('tags');
    }

    // Update cameras
    if (cameras) {
      newer.set('cameras', cameras);
    }
    else {
      newer.delete('cameras');
    }

    // Update lenses
    if (lenses) {
      newer.set('lenses', lenses);
    }
    else {
      newer.delete('lenses');
    }

    // Update rating
    if (rating) {
      newer.set('rating', rating);
    }
    else {
      newer.delete('rating');
    }

    // Update tag filter mode
    if (tagMode) {
      newer.set('tag_mode', tagMode);
    }
    else {
      newer.delete('tag_mode');
    }

    router.replace(`${pathname}?${newer.toString()}`);
  }, [selectedTags, selectedCameras, selectedLenses, selectedRatings, tagFilterMode, pathname]);
}
