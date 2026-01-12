'use client';

import type { PropsWithChildren } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { RemoveScroll } from 'react-remove-scroll';
import { ClientOnly } from '@/components/common/ClientOnly';
import { RootPortal, RootPortalProvider } from '@/components/ui/portal';
import { ScrollArea, ScrollElementContext } from '@/components/ui/scroll-areas';
import { useMobile } from '@/hooks/use-mobile';
import { getFilteredPhotos, useContextPhotos, usePhotoViewer } from '@/hooks/use-photo-viewer';
import { useTitle } from '@/hooks/use-title';
import { deriveAccentFromSources } from '@/lib/color';
import { cn } from '@/lib/utils';
import { PhotosRoot } from '@/modules/gallery/PhotosRoot';
import { PhotoViewer } from '@/modules/viewer';
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

      {/* Viewer 始终在 layout 中，由 URL 控制显示/隐藏 */}
      <PhotoViewerContainer />

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
  // const router = useRouter();
  const pathname = usePathname();
  const { isOpen, currentIndex } = usePhotoViewer();

  // 处理 Viewer 关闭时的导航
  useEffect(() => {
    if (!isRestored)
      return;

    if (!isOpen) {
      const timer = setTimeout(() => {
        window.history.replaceState(
          { ...window.history.state, as: '/photos', url: '/photos' },
          '',
          '/photos',
        );
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // 同步 currentIndex 到 URL（使用 history API 避免页面刷新）
  useEffect(() => {
    if (!isRestored || !isOpen)
      return;

    const photos = getFilteredPhotos();
    const targetPathname = `/photos/${photos[currentIndex].id}`;

    if (pathname !== targetPathname) {
      // 使用 history.replaceState 避免触发 Next.js 路由导航
      const url = new URL(window.location.href);
      url.pathname = targetPathname;
      window.history.replaceState(
        { ...window.history.state, as: url.pathname, url: url.pathname },
        '',
        url.toString(),
      );
    }
  }, [isOpen, currentIndex, pathname]);

  // 同步过滤参数到 URL（使用 history API 避免触发路由）
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

    // 使用 history.replaceState 避免触发 Next.js 路由导航
    const url = new URL(window.location.href);
    url.search = newer.toString();
    window.history.replaceState(
      { ...window.history.state, as: url.pathname + url.search, url: url.pathname + url.search },
      '',
      url.toString(),
    );
  }, [selectedTags, selectedCameras, selectedLenses, selectedRatings, tagFilterMode, searchParams]);
}

// Viewer 容器组件
function PhotoViewerContainer() {
  const photoViewer = usePhotoViewer();
  const photos = useContextPhotos();
  const { photoId } = useParams<{ photoId?: string }>();

  const [ref, setRef] = useState<HTMLElement | null>(null);
  const rootPortalValue = useMemo(
    () => ({
      to: ref as HTMLElement,
    }),
    [ref],
  );

  const currentIndex = useMemo(() => {
    if (!photoId)
      return -1;
    return photos.findIndex(p => p.id === photoId);
  }, [photoId, photos]);

  const currentPhoto = useMemo(() => photos[currentIndex], [currentIndex, photos]);
  useTitle(currentPhoto?.title || '');

  const [accentColor, setAccentColor] = useState<string | null>(null);

  // Handle accent color
  useEffect(() => {
    if (!currentPhoto)
      return;

    let isCancelled = false

    ;(async () => {
      try {
        const color = await deriveAccentFromSources({
          thumbHash: currentPhoto.thumbHash,
          thumbnailUrl: currentPhoto.thumbnailUrl,
        });
        if (!isCancelled) {
          const $css = document.createElement('style');
          $css.textContent = `
         * {
             transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out;
            }
          `;
          document.head.append($css);

          setTimeout(() => {
            $css.remove();
          }, 100);

          setAccentColor(color ?? null);
        }
      }
      catch {
        if (!isCancelled)
          setAccentColor(null);
      }
    })();

    return () => {
      isCancelled = true;
    };
  }, [currentPhoto]);

  // 不要条件渲染！让 PhotoViewer 内部的 AnimatePresence 处理退出动画
  return (
    <ClientOnly>
      <RootPortal>
        <RootPortalProvider value={rootPortalValue}>
          <RemoveScroll
            enabled={photoViewer.isOpen}
            style={
              {
                ...(accentColor ? { '--color-accent': accentColor } : {}),
              } as React.CSSProperties
            }
            ref={setRef}
            className={cn(photoViewer.isOpen ? 'fixed inset-0 z-9999' : 'pointer-events-none fixed inset-0 z-40')}
          >
            <PhotoViewer
              photos={photos}
              currentIndex={photoViewer.currentIndex}
              isOpen={photoViewer.isOpen}
              triggerElement={photoViewer.triggerElement}
              onClose={photoViewer.closeViewer}
              onIndexChange={photoViewer.goToIndex}
            />
          </RemoveScroll>
        </RootPortalProvider>
      </RootPortal>
    </ClientOnly>
  );
}
