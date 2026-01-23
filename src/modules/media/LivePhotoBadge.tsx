import type { FC } from 'react';
import type { LivePhotoBadgeProps } from '@/modules/viewer/types';
import { AnimatePresence, m } from 'motion/react';
import { useCallback } from 'react';

import { isMobileDevice } from '@/lib/device-viewport';
import { isDevelopment } from '@/lib/env';
import { cn } from '@/lib/utils';

export const LivePhotoBadge: FC<LivePhotoBadgeProps> = ({ livePhotoRef, isLivePhotoPlaying }) => {
  const handlePlay = useCallback(async () => {
    if (!livePhotoRef.current?.getIsVideoLoaded() || isLivePhotoPlaying)
      return;
    livePhotoRef.current.play();
  }, [livePhotoRef, isLivePhotoPlaying]);

  const handleStop = useCallback(() => {
    if (!isLivePhotoPlaying)
      return;
    livePhotoRef.current?.stop();
  }, [livePhotoRef, isLivePhotoPlaying]);

  const handleClick = useCallback(() => {
    if (!livePhotoRef.current?.getIsVideoLoaded())
      return;

    if (isLivePhotoPlaying) {
      handleStop();
    }
    else {
      handlePlay();
    }
  }, [livePhotoRef, isLivePhotoPlaying, handlePlay, handleStop]);

  return (
    <>
      {/* Live Photo 标识 */}
      <div
        className={cn(
          'absolute z-20 flex items-center space-x-1 rounded-xl bg-black/50 px-1 py-1 text-xs text-white transition-all duration-200',
          'cursor-pointer hover:bg-black/70',
          isLivePhotoPlaying && 'bg-accent/70 hover:bg-accent/80',
          'top-12 lg:top-4 left-4',
        )}
        onClick={handleClick}
      >
        <i
          className={cn('size-4', isLivePhotoPlaying ? 'i-mingcute-live-photo-fill' : 'i-mingcute-live-photo-line')}
        />
        <span className="mr-1">实况</span>
      </div>

      {/* 播放状态提示 */}
      <AnimatePresence>
        {isLivePhotoPlaying && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute bottom-4 left-1/2 z-20 -translate-x-1/2"
          >
            <div className="flex items-center gap-2 rounded bg-black/50 px-2 py-1 text-xs text-white">
              <i className="i-mingcute-live-photo-fill" />
              <span>正在播放实况照片</span>
            </div>
          </m.div>
        )}
      </AnimatePresence>

      {/* 操作提示 */}
      <div
        className={cn(
          'pointer-events-none absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded bg-black/50 px-2 py-1 text-xs text-white opacity-0 duration-200 group-hover:opacity-50',
          isLivePhotoPlaying && 'opacity-0!',
        )}
      >
        {isMobileDevice ? '轻点实况标识播放实况照片/双击以缩放' : '点击实况标识播放实况照片 / 双击缩放'}
      </div>
    </>
  );
};
