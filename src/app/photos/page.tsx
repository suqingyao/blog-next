'use client';

import { useAtomValue, useSetAtom } from 'jotai';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { ScrollArea, ScrollElementContext } from '@/components/ui/scroll-areas';
import { useMobile } from '@/hooks/use-mobile';
import { getFilteredPhotos, usePhotoViewer } from '@/hooks/use-photo-viewer';
import { PhotosRoot } from '@/modules/gallery/PhotosRoot';
import { gallerySettingAtom } from '@/store/atoms/app';

export default function PhotosPage() {
  useStateRestoreFromUrl();
  useSyncFiltersToUrl();
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
function useStateRestoreFromUrl() {
  const triggerOnceRef = useRef(false);

  const { openViewer } = usePhotoViewer();
  const { photoId } = useParams();
  const setGallerySetting = useSetAtom(gallerySettingAtom);

  const searchParams = useSearchParams();
  useEffect(() => {
    if (triggerOnceRef.current)
      return;
    triggerOnceRef.current = true;
    isRestored = true;

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

    if (photoId) {
      const filteredPhotos = getFilteredPhotos();
      const targetIndex = filteredPhotos.findIndex(photo => photo.id === photoId);

      if (targetIndex !== -1) {
        openViewer(targetIndex);
      }
    }
  }, [openViewer, photoId, searchParams, setGallerySetting]);
}

// Simplified function to only sync filter params (tags, cameras, etc.) to URL
// Photo navigation is now handled by Next.js routing and @modal slot
function useSyncFiltersToUrl() {
  const { selectedTags, selectedCameras, selectedLenses, selectedRatings, tagFilterMode }
    = useAtomValue(gallerySettingAtom);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  // const createQueryString = useCallback(
  //   (name: string, value: string) => {
  //     const params = new URLSearchParams(searchParams.toString());
  //     params.set(name, value);

  //     return params.toString();
  //   },
  //   [searchParams],
  // );

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

    // setSearchParams((search) => {
    //   const currentTags = search.get('tags');
    //   const currentCameras = search.get('cameras');
    //   const currentLenses = search.get('lenses');
    //   const currentRating = search.get('rating');
    //   const currentTagMode = search.get('tag_mode');

    //   // Check if anything has changed
    //   if (
    //     currentTags === tags
    //     && currentCameras === cameras
    //     && currentLenses === lenses
    //     && currentRating === rating
    //     && currentTagMode === tagMode
    //   ) {
    //     return search;
    //   }

    //   const newer = new URLSearchParams(search);

    //   // Update tags
    //   if (tags) {
    //     newer.set('tags', tags);
    //   }
    //   else {
    //     newer.delete('tags');
    //   }

    //   // Update cameras
    //   if (cameras) {
    //     newer.set('cameras', cameras);
    //   }
    //   else {
    //     newer.delete('cameras');
    //   }

    //   // Update lenses
    //   if (lenses) {
    //     newer.set('lenses', lenses);
    //   }
    //   else {
    //     newer.delete('lenses');
    //   }

    //   // Update rating
    //   if (rating) {
    //     newer.set('rating', rating);
    //   }
    //   else {
    //     newer.delete('rating');
    //   }

    //   // Update tag filter mode
    //   if (tagMode) {
    //     newer.set('tag_mode', tagMode);
    //   }
    //   else {
    //     newer.delete('tag_mode');
    //   }

    //   return newer;
    // });
  }, [selectedTags, selectedCameras, selectedLenses, selectedRatings, tagFilterMode, router, pathname, searchParams]);
}
