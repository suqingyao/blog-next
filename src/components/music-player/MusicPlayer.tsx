'use client';

import type { PlayerPosition } from '@/store/atoms/music-player';
import { useEffect, useRef, useState } from 'react';
import { Tooltip } from '@/components/ui/tooltip';
import { APP_HEADER_HEIGHT } from '@/constants';
import { cn } from '@/lib/utils';

import { useMusicPlayer } from '@/store/hooks/use-music-player';

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
    changePosition,
    startDrag,
    endDrag,
  } = useMusicPlayer();

  const [isExpanded, setIsExpanded] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [showPositionMenu, setShowPositionMenu] = useState(false);
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
   * 处理音量滑块变化
   */
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number.parseFloat(e.target.value);
    setVolume(newVolume);
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

  // 点击外部关闭位置菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showPositionMenu
        && playerRef.current
        && !playerRef.current.contains(event.target as Node)
      ) {
        setShowPositionMenu(false);
      }
    };

    if (showPositionMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showPositionMenu]);

  /**
   * 位置选择菜单选项
   */
  const positionOptions: { value: PlayerPosition; label: string }[] = [
    { value: 'tl', label: 'top-left' },
    { value: 'tr', label: 'top-right' },
    { value: 'bl', label: 'bottom-left' },
    { value: 'br', label: 'bottom-right' },
  ];

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
          'rounded-xl border border-black/10 bg-white/95 backdrop-blur-sm transition-all duration-300 dark:border-white/10 dark:bg-black/90',
          isDragging && 'scale-110 shadow-2xl',
          isExpanded ? 'h-auto w-80 p-3' : 'h-16 w-16 p-2',
          !isExpanded
            ? isDragging
              ? 'cursor-grabbing'
              : 'cursor-grab'
            : 'cursor-default',
        )}
        onClick={handleClick}
        onMouseDown={!isExpanded ? handleMouseDown : undefined}
      >
        {!isExpanded ? (
          /* 收缩状态 - 只显示音乐图标和播放状态 */
          <div className="relative flex h-full w-full items-center justify-center">
            <i className="i-mingcute-music-fill h-6 w-6 text-gray-600 dark:text-gray-300" />
            {isPlaying && (
              <div className="bg-primary absolute -top-1 -right-1 h-3 w-3 animate-pulse rounded-full" />
            )}
          </div>
        ) : (
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
                {/* 位置选择按钮 */}
                <div className="relative">
                  <button
                    onClick={() => setShowPositionMenu(!showPositionMenu)}
                    className="flex items-center justify-center rounded-full border-none bg-transparent p-1 text-gray-500 transition-all duration-200 hover:bg-black/5 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-gray-300"
                    title="Select Position"
                  >
                    <i className="i-mingcute-location-line h-4 w-4" />
                  </button>

                  {/* 位置选择菜单 */}
                  {showPositionMenu && (
                    <div className="absolute top-full right-0 z-[10000] mt-1 min-w-[120px] rounded-lg border border-black/10 bg-white shadow-lg dark:border-white/10 dark:bg-gray-800">
                      {positionOptions.map(option => (
                        <button
                          key={option.value}
                          onClick={() => {
                            changePosition(option.value);
                            setShowPositionMenu(false);
                          }}
                          className={cn(
                            'block w-full border-none bg-transparent px-3 py-2 text-left text-xs text-gray-700 transition-colors hover:bg-black/5 dark:text-gray-300 dark:hover:bg-white/10',
                            position === option.value && 'bg-primary text-white',
                          )}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 关闭按钮 */}
                <button
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
                onClick={playPrevious}
                className="flex items-center justify-center rounded-full border-none bg-transparent p-2 text-gray-500 transition-all duration-200 hover:bg-black/5 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-gray-300"
              >
                <i className="i-mingcute-skip-previous-fill h-4 w-4" />
              </button>

              <button
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
                onClick={playNext}
                className="flex items-center justify-center rounded-full border-none bg-transparent p-2 text-gray-500 transition-all duration-200 hover:bg-black/5 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-gray-300"
              >
                <i className="i-mingcute-skip-forward-fill h-4 w-4" />
              </button>

              {/* 音量控制 */}
              <div className="flex items-center">
                <Tooltip delayDuration={200}>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <button className="flex items-center justify-center rounded-full bg-transparent p-2 text-gray-500 transition-all duration-200 hover:bg-black/5 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-gray-300">
                        {isMuted
                          ? (
                              <i className="i-mingcute-volume-mute-fill h-4 w-4" />
                            )
                          : (
                              <i className="i-mingcute-volume-fill h-4 w-4" />
                            )}
                      </button>
                    </Tooltip.Trigger>
                    <Tooltip.Content
                      side="top"
                      className="rounded-2xl border-none bg-transparent bg-none p-0 shadow-none ring-0"
                    >
                      <div className="relative flex flex-col items-center">
                        {/* 音量滑块容器 */}
                        <div className="relative flex h-36 w-10 flex-col items-center justify-between gap-2 rounded-2xl p-2 shadow-lg backdrop-blur-sm dark:bg-black/90">
                          {/* 音量滑块轨道 */}
                          <div
                            className="relative flex h-24 w-1 cursor-pointer flex-col justify-end"
                            data-volume-slider
                            onClick={handleVolumeSliderClick}
                            onMouseDown={handleVolumeSliderMouseDown}
                          >
                            {/* 背景轨道 */}
                            <div className="absolute inset-0 w-1 rounded-full bg-gray-300 dark:bg-gray-600" />

                            {/* 活跃轨道 */}
                            <div
                              className="bg-primary w-1 rounded-full transition-all duration-150"
                              style={{
                                height: `${(isMuted ? 0 : volume) * 100}%`,
                              }}
                            />

                            {/* 滑块手柄 */}
                            <div
                              className="bg-primary absolute left-1/2 h-3 w-3 origin-center -translate-x-1/2 translate-y-1/2 rounded-full shadow-md transition-all duration-150 hover:scale-110"
                              style={{
                                bottom: `${(isMuted ? 0 : volume) * 100}%`,
                              }}
                            />
                          </div>

                          {/* 百分比显示 */}
                          <span className="text-xs font-light text-gray-600 dark:text-gray-300">
                            {Math.round(isMuted ? 0 : volume * 100)}
                            %
                          </span>

                          {/* 音量图标 */}
                          <button
                            onClick={toggleMute}
                            className="cursor-pointer text-gray-600 opacity-80 transition-all duration-150 hover:text-gray-800 hover:opacity-100 dark:text-gray-300 dark:hover:text-gray-100"
                          >
                            {isMuted
                              ? (
                                  <i className="i-mingcute-volume-mute-fill h-3 w-3" />
                                )
                              : (
                                  <i className="i-mingcute-volume-fill h-3 w-3" />
                                )}
                          </button>
                        </div>
                      </div>
                    </Tooltip.Content>
                  </Tooltip.Root>
                </Tooltip>
              </div>
            </div>

            {/* 进度条 */}
            <div className="flex items-center justify-between gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span>{formatTime(currentTime)}</span>
              <div
                className="group h-1 flex-1 cursor-pointer rounded-full bg-black/10 dark:bg-white/20"
                onClick={handleProgressClick}
              >
                <div
                  className="bg-primary after:bg-primary relative h-1 rounded-full transition-[width] duration-100 ease-linear after:absolute after:top-1/2 after:-right-1 after:hidden after:h-2 after:w-2 after:translate-y-[-50%] after:rounded-full after:content-[''] group-hover:after:block"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
