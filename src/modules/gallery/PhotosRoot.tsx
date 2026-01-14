'use client';

import type { PanelType } from './ActionPanel';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { ClientOnly } from '@/components/common/ClientOnly';

import { useScrollViewElement } from '@/components/ui/scroll-areas';
import { useHasActiveFilters } from '@/hooks/use-has-active-filters';
import { useContextPhotos } from '@/hooks/use-photo-viewer';
import { useVisiblePhotosDateRange } from '@/hooks/use-visible-photos-date-range';

import { cn } from '@/lib/utils';
import { gallerySettingAtom } from '@/store/atoms/app';
import { ActionPanel } from './ActionPanel';
import { ActiveFiltersHero } from './ActiveFiltersHero';
import { ListView } from './ListView';
import { MasonryView } from './MasonryView';
// import { PageHeader } from './PageHeader';

export function PhotosRoot() {
  const { viewMode } = useAtomValue(gallerySettingAtom);
  const [showFloatingActions, setShowFloatingActions] = useState(false);

  const photos = useContextPhotos();
  const { dateRange, handleRender } = useVisiblePhotosDateRange(photos);
  const scrollElement = useScrollViewElement();

  const [activePanel, setActivePanel] = useState<PanelType | null>(null);

  // 监听滚动，控制浮动组件的显示
  useEffect(() => {
    if (!scrollElement)
      return;

    const handleScroll = () => {
      const { scrollTop } = scrollElement;
      setShowFloatingActions(scrollTop > 500);
    };

    scrollElement.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      scrollElement.removeEventListener('scroll', handleScroll);
    };
  }, [scrollElement]);

  const hasActiveFilters = useHasActiveFilters();

  return (
    <ClientOnly>
      {/* <PageHeader
        dateRange={dateRange.formattedRange}
        location={dateRange.location}
        showDateRange={showFloatingActions && !!dateRange.formattedRange}
      /> */}

      {hasActiveFilters && <ActiveFiltersHero />}

      <div className={cn('p-1 **:select-none! lg:px-0 lg:pb-0')}>
        {viewMode === 'list' ? <ListView photos={photos} /> : <MasonryView photos={photos} onRender={handleRender} />}
      </div>

      <ActionPanel
        open={!!activePanel}
        onOpenChange={(open) => {
          if (!open) {
            setActivePanel(null);
          }
        }}
        type={activePanel}
      />
    </ClientOnly>
  );
}
