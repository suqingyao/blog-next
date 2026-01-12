'use client';

import type { PropsWithChildren } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { ScrollArea, ScrollElementContext } from '@/components/ui/scroll-areas';
import { useMobile } from '@/hooks/use-mobile';
import { getFilteredPhotos, usePhotoViewer } from '@/hooks/use-photo-viewer';
import { PhotosRoot } from '@/modules/gallery/PhotosRoot';
import { gallerySettingAtom } from '@/store/atoms/app';

// const siteConfig = {
//   accentColor: 'var(--color-primary)',
// };

export default function PhotosLayout({ children }: PropsWithChildren) {
  useStateRestoreFromUrl();
  useSyncStateToUrl();

  const isMobile = useMobile();

  return (
    <>
      {/* {siteConfig.accentColor && (
        <style
          dangerouslySetInnerHTML={{
            __html: `
          :root:has(input.theme-controller[value=dark]:checked), [data-theme="dark"] {
            --color-primary: ${siteConfig.accentColor};
            --color-accent: ${siteConfig.accentColor};
            --color-secondary: ${siteConfig.accentColor};
          }
          `,
          }}
        />
      )} */}
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
      {children}
    </>
  );
}

let isRestored = false;

// 同步 URL -> 状态
function useStateRestoreFromUrl() {
  const { photoId } = useParams<{ photoId?: string }>();
  const { openViewer } = usePhotoViewer();

  const triggerOnceRef = useRef(false);
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
  }, [searchParams, setGallerySetting, openViewer, photoId]);
}

// 同步 状态 -> URL（仅过滤参数）
function useSyncStateToUrl() {
  const { selectedTags, selectedCameras, selectedLenses, selectedRatings, tagFilterMode }
    = useAtomValue(gallerySettingAtom);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { isOpen, currentIndex } = usePhotoViewer();

  useEffect(() => {
    if (!isRestored)
      return;

    if (!isOpen) {
      const timer = setTimeout(() => {
        router.push('/photos');
      }, 500);
      return () => clearTimeout(timer);
    }
    else {
      const photos = getFilteredPhotos();
      const targetPathname = `/photos/${photos[currentIndex].id}`;
      if (pathname !== targetPathname) {
        router.push(targetPathname);
      }
    }
  }, [isOpen, currentIndex, pathname, router]);

  useEffect(() => {
    if (!isRestored)
      return;

    const tags = selectedTags.join(',');
    const cameras = selectedCameras.join(',');
    const lenses = selectedLenses.join(',');
    const rating = selectedRatings?.toString() ?? '';
    const tagMode = tagFilterMode === 'union' ? '' : tagFilterMode;

    const currentTags = searchParams.get('tags') ?? '';
    const currentCameras = searchParams.get('cameras') ?? '';
    const currentLenses = searchParams.get('lenses') ?? '';
    const currentRating = searchParams.get('rating') ?? '';
    const currentTagMode = searchParams.get('tag_mode') ?? '';

    if (currentTags === tags
      && currentCameras === cameras
      && currentLenses === lenses
      && currentRating === rating
      && currentTagMode === tagMode) {
      return;
    }

    const newer = new URLSearchParams(searchParams.toString());

    tags ? newer.set('tags', tags) : newer.delete('tags');
    cameras ? newer.set('cameras', cameras) : newer.delete('cameras');
    lenses ? newer.set('lenses', lenses) : newer.delete('lenses');
    rating ? newer.set('rating', rating) : newer.delete('rating');
    tagMode ? newer.set('tag_mode', tagMode) : newer.delete('tag_mode');

    router.replace(`${pathname}?${newer.toString()}`, { scroll: false });
  }, [selectedTags, selectedCameras, selectedLenses, selectedRatings, tagFilterMode, pathname, searchParams.toString(), router]);
}
