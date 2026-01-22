'use client';

import { useEffect, useRef, useState } from 'react';
import { Tooltip, TooltipContent, TooltipRoot, TooltipTrigger } from '@/components/ui/tooltip';
import { APP_HEADER_HEIGHT } from '@/constants';
import { useMusicPlayer } from '@/hooks/use-music-player';

import { cn } from '@/lib/utils';

export function MusicPlayer() {
  const {
    currentTrack,
    isPlaying,
    volume,
    currentTime,
    duration,
    isLoading,
    isMuted,
    progress,
    needsUserInteraction,
    position,
    isDragging,
    dragOffset,
    togglePlay,
    playNext,
    playPrevious,
    setVolume,
    toggleMute,
    seekTo,
    formatTime,
    initializePlayer,
    startPlayback,
    startDrag,
    endDrag,
  } = useMusicPlayer();

  const [isExpanded, setIsExpanded] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const playerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false);

  // 初始化播放器
  useEffect(() => {
    initializePlayer();
  }, [initializePlayer]);

  /**
   * 处理进度条点击
   */
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    seekTo(newTime);
  };

  /**
   * 处理垂直音量滑块点击和拖拽
   */
  const [isVolumeSliderDragging, setIsVolumeSliderDragging] = useState(false);

  const handleVolumeSliderClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const percentage = 1 - clickY / rect.height; // 反转Y轴，顶部为100%
    const newVolume = Math.max(0, Math.min(1, percentage));

    // 如果当前是静音状态，先取消静音
    if (isMuted) {
      toggleMute();
    }

    setVolume(newVolume);
  };

  const handleVolumeSliderMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsVolumeSliderDragging(true);

    // 如果当前是静音状态，先取消静音
    if (isMuted) {
      toggleMute();
    }

    handleVolumeSliderClick(e);
  };

  const handleVolumeSliderMouseMove = (e: MouseEvent) => {
    if (!isVolumeSliderDragging)
      return;

    const sliderElement = document.querySelector(
      '[data-volume-slider]',
    ) as HTMLElement;
    if (!sliderElement)
      return;

    const rect = sliderElement.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const percentage = 1 - clickY / rect.height;
    const newVolume = Math.max(0, Math.min(1, percentage));
    setVolume(newVolume);
  };

  const handleVolumeSliderMouseUp = () => {
    setIsVolumeSliderDragging(false);
  };

  useEffect(() => {
    if (isVolumeSliderDragging) {
      document.addEventListener('mousemove', handleVolumeSliderMouseMove);
      document.addEventListener('mouseup', handleVolumeSliderMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleVolumeSliderMouseMove);
        document.removeEventListener('mouseup', handleVolumeSliderMouseUp);
      };
    }
  }, [isVolumeSliderDragging]);

  /**
   * 获取播放器位置样式
   */
  const getPositionStyle = () => {
    if (isDragging) {
      return {
        left: `${dragPosition.x}px`,
        top: `${dragPosition.y}px`,
        right: 'auto',
        bottom: 'auto',
      };
    }

    const headerHeight = APP_HEADER_HEIGHT; // 预留header高度
    const margin = 24; // 边距

    switch (position) {
      case 'tl':
        return {
          left: `${margin}px`,
          top: `${headerHeight + margin}px`,
          right: 'auto',
          bottom: 'auto',
        };
      case 'tr':
        return {
          right: `${margin}px`,
          top: `${headerHeight + margin}px`,
          left: 'auto',
          bottom: 'auto',
        };
      case 'bl':
        return {
          left: `${margin}px`,
          bottom: `${margin}px`,
          right: 'auto',
          top: 'auto',
        };
      case 'br':
      default:
        return {
          right: `${margin}px`,
          bottom: `${margin}px`,
          left: 'auto',
          top: 'auto',
        };
    }
  };

  /**
   * 处理鼠标按下事件（开始拖拽）
   */
  const handleMouseDown = (e: React.MouseEvent) => {
    // 检查是否点击在按钮或交互元素上
    const target = e.target as HTMLElement;
    if (
      target.closest('button')
      || target.closest('input')
      || target.closest('[role="button"]')
    ) {
      return;
    }

    e.preventDefault();
    isDraggingRef.current = true;
    hasDraggedRef.current = false; // 重置拖拽状态

    const rect = playerRef.current?.getBoundingClientRect();
    if (rect) {
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;
      startDrag({ x: offsetX, y: offsetY });

      setDragPosition({
        x: e.clientX - offsetX,
        y: e.clientY - offsetY,
      });
    }
  };

  /**
   * 处理鼠标移动事件（拖拽中）
   */
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDraggingRef.current || !isDragging)
      return;

    e.preventDefault();
    hasDraggedRef.current = true; // 标记已发生拖拽移动
    setDragPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y,
    });
  };

  /**
   * 处理鼠标释放事件（结束拖拽）
   */
  const handleMouseUp = (e: MouseEvent) => {
    if (!isDraggingRef.current)
      return;

    isDraggingRef.current = false;
    endDrag(e.clientX, e.clientY);
  };

  /**
   * 处理点击事件（展开播放器）
   */
  const handleClick = () => {
    // 只有在没有发生拖拽移动时才展开
    if (!hasDraggedRef.current && !isExpanded) {
      setIsExpanded(true);
    }
  };

  // 添加全局鼠标事件监听
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset.x, dragOffset.y]);

  if (!currentTrack) {
    return null;
  }

  return (
    <div
      className="fixed z-[9999]"
      style={getPositionStyle()}
    >
      {/* 用户交互提示 */}
      {needsUserInteraction && (
        <div className="mb-3 rounded-lg border border-yellow-400 bg-yellow-100 p-3 shadow-md dark:border-yellow-600 dark:bg-yellow-900/20">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-yellow-400" />
            <p className="text-sm text-yellow-700 dark:text-yellow-400">
              Need to click the play button to start the music
            </p>
          </div>
          <button
            type="button"
            onClick={startPlayback}
            className="mt-2 w-full rounded-md bg-yellow-500 px-3 py-1 text-sm text-white transition-colors hover:bg-yellow-600"
          >
            Start Playback
          </button>
        </div>
      )}

      {/* 主播放器容器 */}
      <div
        ref={playerRef}
        className={cn(
          'border border-black/10 bg-white/95 backdrop-blur-sm transition-all duration-300 dark:border-white/10 dark:bg-black/90',
          isDragging && 'scale-110 shadow-2xl',
          isExpanded ? 'h-auto w-80 p-3 rounded-xl' : 'h-10 w-10 p-2 rounded-full',
          !isExpanded
            ? isDragging
              ? 'cursor-grabbing'
              : 'cursor-grab'
            : 'cursor-default',
        )}
        onClick={handleClick}
        onMouseDown={!isExpanded ? handleMouseDown : undefined}
      >
        {!isExpanded
          ? (
        /* 收缩状态 - 只显示音乐图标和播放状态 */
              <div className={cn(
                'relative flex h-full w-full items-center justify-center',
                isPlaying && 'animate-[spin_3s_linear_infinite]',
              )}
              >
                <i className="i-mingcute-music-fill h-5 w-5 text-gray-600 dark:text-gray-300" />
              </div>
            )
          : (
        /* 展开状态 - 完整播放器 */
              <div className="space-y-3">
                {/* 头部 - 歌曲信息和控制按钮 */}
                <div
                  className={cn(
                    'mb-3 flex items-center justify-between',
                    !isDragging && 'cursor-grab',
                    isDragging && 'cursor-grabbing',
                  )}
                  onMouseDown={handleMouseDown}
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold text-gray-800 dark:text-gray-100">
                      {currentTrack.title}
                    </h3>
                    <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                      {currentTrack.artist || '未知艺术家'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* 关闭按钮 */}
                    <button
                      type="button"
                      onClick={() => setIsExpanded(false)}
                      className="flex items-center justify-center rounded-full border-none bg-transparent p-1 text-gray-500 transition-all duration-200 hover:bg-red-100 hover:text-red-500 dark:text-gray-400 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                    >
                      <i className="i-mingcute-close-line h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* 控制按钮 */}
                <div className="mb-3 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={playPrevious}
                    className="flex items-center justify-center rounded-full border-none bg-transparent p-2 text-gray-500 transition-all duration-200 hover:bg-black/5 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-gray-300"
                  >
                    <i className="i-mingcute-skip-previous-fill h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={needsUserInteraction ? startPlayback : togglePlay}
                    disabled={isLoading}
                    className={cn(
                      'bg-primary flex h-10 w-10 items-center justify-center rounded-full border-none p-2 text-white transition-all duration-200 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50',
                    )}
                  >
                    {isLoading
                      ? (
                          <div className="flex h-5 w-5 animate-spin items-center justify-center rounded-full border-2 border-white border-t-transparent" />
                        )
                      : isPlaying
                        ? (
                            <i className="i-mingcute-pause-fill h-5 w-5" />
                          )
                        : (
                            <i className="i-mingcute-play-fill h-5 w-5" />
                          )}
                  </button>

                  <button
                    type="button"
                    onClick={playNext}
                    className="flex items-center justify-center rounded-full border-none bg-transparent p-2 text-gray-500 transition-all duration-200 hover:bg-black/5 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-gray-300"
                  >
                    <i className="i-mingcute-skip-forward-fill h-4 w-4" />
                  </button>

                  {/* 音量控制 */}
                  <div className="flex items-center">
                    <Tooltip delayDuration={0}>
                      <TooltipRoot>
                        <TooltipTrigger asChild>
                          <button type="button" className="flex items-center justify-center rounded-full bg-transparent p-2 text-gray-500 transition-all duration-200 hover:bg-black/5 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-gray-300">
                            {isMuted
                              ? (
                                  <i className="i-mingcute-volume-mute-fill h-4 w-4" />
                                )
                              : (
                                  <i className="i-mingcute-volume-fill h-4 w-4" />
                                )}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent
                          side="top"
                          sideOffset={10}
                          className="rounded-2xl border-none bg-transparent bg-none p-0 shadow-none ring-0"
                        >
                          <div className="relative flex flex-col items-center">
                            {/* 音量滑块容器 */}
                            <div className="relative flex h-32 w-10 flex-col items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-white/90 p-3 shadow-xl backdrop-blur-md dark:border-zinc-700 dark:bg-zinc-800/90">

                              {/* 百分比显示 */}
                              <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">
                                {Math.round(isMuted ? 0 : volume * 100)}
                                %
                              </span>

                              {/* 音量滑块轨道 */}
                              <div
                                className="relative flex h-20 w-1.5 cursor-pointer flex-col justify-end rounded-full bg-zinc-200 dark:bg-zinc-600"
                                data-volume-slider
                                onClick={handleVolumeSliderClick}
                                onMouseDown={handleVolumeSliderMouseDown}
                              >
                                {/* 活跃轨道 */}
                                <div
                                  className="bg-primary w-full rounded-full transition-all duration-75"
                                  style={{
                                    height: `${(isMuted ? 0 : volume) * 100}%`,
                                  }}
                                />

                                {/* 滑块手柄 */}
                                <div
                                  className="bg-primary absolute left-1/2 h-3.5 w-3.5 origin-center -translate-x-1/2 translate-y-1/2 rounded-full transition-transform duration-75 hover:scale-110 dark:border-zinc-800"
                                  style={{
                                    bottom: `${(isMuted ? 0 : volume) * 100}%`,
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </TooltipContent>
                      </TooltipRoot>
                    </Tooltip>
                  </div>
                </div>

                {/* 进度条 */}
                <div className="flex items-center justify-between gap-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                  <span className="w-9 text-right tabular-nums">{formatTime(currentTime)}</span>
                  <div
                    className="group relative flex h-4 flex-1 cursor-pointer items-center"
                    onClick={handleProgressClick}
                  >
                    {/* 轨道背景 */}
                    <div className="absolute h-1 w-full rounded-full bg-zinc-200 transition-all duration-200 group-hover:h-1.5 dark:bg-zinc-700">
                      {/* 进度 */}
                      <div
                        className="bg-primary absolute h-full rounded-full transition-all duration-100 ease-linear"
                        style={{
                          width: `${progress}%`,
                        }}
                      >
                        {/* 拖拽手柄 - 仅在 hover 时显示 */}
                        <div className="absolute -right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 scale-0 rounded-full bg-white shadow-md ring-2 ring-primary transition-transform duration-200 group-hover:scale-100 dark:bg-zinc-200" />
                      </div>
                    </div>
                  </div>
                  <span className="w-9 tabular-nums">{formatTime(duration)}</span>
                </div>
              </div>
            )}
      </div>
    </div>
  );
}
