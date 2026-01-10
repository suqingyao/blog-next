import type { FC } from 'react';
import type { PhotoManifest, PickedExif } from '@/types/photo';
// import { useQuery } from '@tanstack/react-query';
// import clsx from 'clsx';
import { m } from 'motion/react';
import { useState } from 'react';
// import { useTranslation } from 'react-i18next';
import { MobileTabGroup, MobileTabItem } from '@/components/ui/mobile-tab';
import { SegmentGroup, SegmentItem } from '@/components/ui/segment';

// import { injectConfig } from '@/config';
import { useMobile } from '@/hooks/use-mobile';
// import { commentsApi } from '@/lib/api/comments';
import { Spring } from '@/lib/spring';
import { ExifPanelContent } from '@/modules/metadata/ExifPanel';
// import { CommentsPanel } from '@/modules/social/comments';

type Tab = 'info' | 'comments';

export const InspectorPanel: FC<{
  currentPhoto: PhotoManifest;
  exifData: PickedExif | null;
  onClose?: () => void;
  visible?: boolean;
}> = ({ currentPhoto, exifData, onClose, visible = true }) => {
  // const { t } = useTranslation();
  const isMobile = useMobile();
  const [activeTab, setActiveTab] = useState<Tab>('info');

  // const showSocialFeatures = injectConfig.useCloud;
  // const { data: commentCount } = useQuery({
  //   queryKey: ['comment-count', currentPhoto.id],
  //   queryFn: () => commentsApi.count(currentPhoto.id),
  //   enabled: showSocialFeatures,
  // });

  // const hasComments = (commentCount?.count ?? 0) > 0;

  return (
    <m.div
      className={`${
        isMobile
          ? 'inspector-panel-mobile fixed right-0 bottom-0 left-0 z-10 h-[60vh] w-full rounded-t-lg backdrop-blur-2xl'
          : 'relative w-80 shrink-0 backdrop-blur-2xl'
      } border-accent/20 flex flex-col text-white`}
      initial={{
        opacity: 0,
        ...(isMobile ? { y: 100 } : { x: 100 }),
      }}
      animate={{
        opacity: visible ? 1 : 0,
        ...(isMobile ? { y: visible ? 0 : 100 } : { x: visible ? 0 : 100 }),
      }}
      exit={{
        opacity: 0,
        ...(isMobile ? { y: 100 } : { x: 100 }),
      }}
      transition={Spring.presets.smooth}
      style={{
        pointerEvents: visible ? 'auto' : 'none',
        backgroundImage:
          'linear-gradient(to bottom right, rgba(var(--color-materialMedium)), rgba(var(--color-materialThick)))',
        boxShadow:
          '0 8px 32px color-mix(in srgb, var(--color-accent) 8%, transparent), 0 4px 16px color-mix(in srgb, var(--color-accent) 6%, transparent), 0 2px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Inner glow layer */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom right, color-mix(in srgb, var(--color-accent) 5%, transparent), transparent, color-mix(in srgb, var(--color-accent) 5%, transparent))',
        }}
      />

      {/* Header with tabs and actions */}
      <div className="relative z-50 shrink-0">
        {isMobile
          ? (
        /* Mobile: MobileTabGroup */
              <div className="relative">
                <MobileTabGroup value={activeTab} onValueChanged={(value: Tab) => setActiveTab(value)} className="mr-12">
                  <MobileTabItem
                    value="info"
                    label={(
                      <div className="flex items-center">
                        <i className="i-mingcute-information-line mr-1.5 text-base" />
                        {/* {t('inspector.tab.info')} */}
                        信息
                      </div>
                    )}
                  />
                  {/* {showSocialFeatures && (
                    <MobileTabItem
                      value="comments"
                      label={(
                        <div className="flex items-center">
                          <i className="i-mingcute-comment-line mr-1.5 text-base" />
                          {t('inspector.tab.comments')}
                          {hasComments && <div className="bg-accent ml-1.5 size-1.5 rounded-full" />}
                        </div>
                      )}
                    />
                  )} */}
                </MobileTabGroup>
                {onClose && (
                  <button
                    type="button"
                    className="hover:bg-accent/10 absolute top-4 right-4 flex size-9 items-center justify-center rounded-lg text-white/80 transition-colors hover:text-white"
                    onClick={onClose}
                  >
                    <i className="i-mingcute-close-line text-lg" />
                  </button>
                )}
              </div>
            )
          : (
        /* Desktop: Segment control */
              <div className="relative mt-3.5 mb-3 flex items-center justify-between px-3.5">
                <div className="size-8" />
                <SegmentGroup
                  value={activeTab}
                  onValueChanged={(value: Tab) => setActiveTab(value)}
                  className="border-accent/20 bg-material-ultra-thick rounded text-white"
                >
                  <SegmentItem
                    value="info"
                    activeBgClassName="bg-accent/20"
                    className="text-white/60 hover:text-white/80 data-[state=active]:text-white"
                    label={(
                      <div className="flex items-center">
                        <i className="i-mingcute-information-line mr-1.5" />
                        {/* {t('inspector.tab.info')} */}
                        信息
                      </div>
                    )}
                  />
                  {/* {showSocialFeatures && (
                    <SegmentItem
                      value="comments"
                      activeBgClassName="bg-accent/20"
                      className="text-white/60 hover:text-white/80 data-[state=active]:text-white"
                      label={(
                        <div className={clsx('flex items-center', hasComments && 'pr-0.5')}>
                          <i className="i-mingcute-comment-line mr-1.5" />
                          {t('inspector.tab.comments')}
                          {hasComments && <div className="bg-accent absolute top-1 right-1 size-1.5 rounded-full" />}
                        </div>
                      )}
                    />
                  )} */}
                </SegmentGroup>
                {onClose && (
                  <button
                    type="button"
                    className="bg-material-ultra-thick pointer-events-auto flex size-8 items-center justify-center rounded-full text-white backdrop-blur-2xl duration-200 hover:bg-black/40"
                    onClick={onClose}
                    aria-label="Collapse inspector panel"
                  >
                    <i className="i-lucide-panel-right-close" />
                  </button>
                )}
              </div>
            )}
      </div>

      {/* Content area */}
      <div className="relative z-10 flex min-h-0 flex-1">
        {activeTab === 'info'
          ? (
              <ExifPanelContent currentPhoto={currentPhoto} exifData={exifData} />
            )
          : (
              // <CommentsPanel photoId={currentPhoto.id} visible={visible} />
              null
            )}
      </div>
    </m.div>
  );
};
