import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useEffect, useRef } from 'react';
import {
  musicPlayerAtom,
  togglePlayAtom,
  setCurrentTimeAtom,
  setVolumeAtom,
  toggleMuteAtom,
  playNextAtom,
  playPreviousAtom,
  selectTrackAtom,
  setNeedsUserInteractionAtom,
  loadPlaylistAtom,
  setPlayerPositionAtom,
  setDraggingAtom,
  setDragOffsetAtom,
  type MusicTrack,
  type PlayerPosition
} from '@/store/atoms/music-player';
import { consoleLog } from '@/lib/console';

/**
 * 音乐播放器自定义 Hook
 * 提供音乐播放的完整功能
 */
export const useMusicPlayer = () => {
  const [state, setState] = useAtom(musicPlayerAtom);
  const togglePlay = useSetAtom(togglePlayAtom);
  const setCurrentTime = useSetAtom(setCurrentTimeAtom);
  const setVolume = useSetAtom(setVolumeAtom);
  const toggleMute = useSetAtom(toggleMuteAtom);
  const playNext = useSetAtom(playNextAtom);
  const playPrevious = useSetAtom(playPreviousAtom);
  const selectTrack = useSetAtom(selectTrackAtom);
  const setNeedsUserInteraction = useSetAtom(setNeedsUserInteractionAtom);
  const loadPlaylist = useSetAtom(loadPlaylistAtom);
  const setPlayerPosition = useSetAtom(setPlayerPositionAtom);
  const setDragging = useSetAtom(setDraggingAtom);
  const setDragOffset = useSetAtom(setDragOffsetAtom);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  /**
   * 初始化音频元素
   */
  useEffect(() => {
    if (typeof window !== 'undefined' && !audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = 'metadata';

      // 设置音频事件监听器
      const audio = audioRef.current;

      const handleLoadedMetadata = () => {
        setState((prev) => ({
          ...prev,
          duration: audio.duration || 0,
          isLoading: false
        }));
      };

      const handleTimeUpdate = () => {
        setState((prev) => ({
          ...prev,
          currentTime: audio.currentTime || 0
        }));
      };

      const handleEnded = () => {
        playNext();
      };

      const handleLoadStart = () => {
        setState((prev) => ({
          ...prev,
          isLoading: true
        }));
      };

      const handleCanPlay = () => {
        setState((prev) => ({
          ...prev,
          isLoading: false
        }));
      };

      const handleError = () => {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          isPlaying: false
        }));
      };

      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('loadstart', handleLoadStart);
      audio.addEventListener('canplay', handleCanPlay);
      audio.addEventListener('error', handleError);

      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('loadstart', handleLoadStart);
        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('error', handleError);
      };
    }
  }, [setState, playNext]);

  /**
   * 当前曲目变化时更新音频源
   */
  useEffect(() => {
    if (audioRef.current && state.currentTrack) {
      audioRef.current.src = state.currentTrack.src;
      audioRef.current.load();
    }
  }, [state.currentTrack]);

  /**
   * 播放状态变化时控制音频播放
   */
  useEffect(() => {
    if (audioRef.current) {
      if (state.isPlaying && state.currentTrack) {
        audioRef.current.play().catch((error) => {
          consoleLog('WARN', '播放失败:', error.message);
          // 如果是自动播放被阻止，重置播放状态并标记需要用户交互
          if (error.name === 'NotAllowedError') {
            setState((prev) => ({
              ...prev,
              isPlaying: false
            }));
            setNeedsUserInteraction(true);
          }
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [state.isPlaying, state.currentTrack, setState]);

  /**
   * 音量变化时更新音频音量
   */
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = state.isMuted ? 0 : state.volume;
    }
  }, [state.volume, state.isMuted]);

  /**
   * 跳转到指定时间
   */
  const seekTo = useCallback(
    (time: number) => {
      if (audioRef.current) {
        audioRef.current.currentTime = time;
        setCurrentTime(time);
      }
    },
    [setCurrentTime]
  );

  /**
   * 初始化播放器（加载播放列表并设置第一首歌）
   */
  const initializePlayer = useCallback(async () => {
    // 如果播放列表为空，先加载播放列表
    if (state.playlist.length === 0) {
      await loadPlaylist();
    }

    // 设置第一首歌为当前曲目（如果还没有设置）
    if (state.playlist.length > 0 && !state.currentTrack) {
      selectTrack(0);
    }
  }, [state.playlist, state.currentTrack, selectTrack, loadPlaylist]);

  /**
   * 格式化时间显示
   */
  const formatTime = useCallback((seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  /**
   * 手动启动播放（用于处理自动播放限制）
   */
  const startPlayback = useCallback(() => {
    setNeedsUserInteraction(false);
    togglePlay();
  }, [setNeedsUserInteraction, togglePlay]);

  /**
   * 设置播放器位置
   */
  const changePosition = useCallback(
    (position: PlayerPosition) => {
      setPlayerPosition(position);
    },
    [setPlayerPosition]
  );

  /**
   * 开始拖拽
   */
  const startDrag = useCallback(
    (offset: { x: number; y: number }) => {
      setDragging(true);
      setDragOffset(offset);
    },
    [setDragging, setDragOffset]
  );

  /**
   * 结束拖拽并吸附到最近的位置
   */
  const endDrag = useCallback(
    (clientX: number, clientY: number) => {
      setDragging(false);

      // 获取窗口尺寸
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // 计算最近的位置
      const isLeft = clientX < windowWidth / 2;
      const isTop = clientY < windowHeight / 2;

      let newPosition: PlayerPosition;
      if (isTop && isLeft) {
        newPosition = 'tl';
      } else if (isTop && !isLeft) {
        newPosition = 'tr';
      } else if (!isTop && isLeft) {
        newPosition = 'bl';
      } else {
        newPosition = 'br';
      }

      setPlayerPosition(newPosition);
    },
    [setDragging, setPlayerPosition]
  );

  return {
    // 状态
    ...state,

    // 操作方法
    togglePlay,
    setVolume,
    toggleMute,
    playNext,
    playPrevious,
    selectTrack,
    seekTo,
    initializePlayer,
    startPlayback,

    // 位置和拖拽方法
    changePosition,
    startDrag,
    endDrag,

    // 工具方法
    formatTime,

    // 计算属性
    progress:
      state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0,
    hasNext: state.currentIndex < state.playlist.length - 1,
    hasPrevious: state.currentIndex > 0
  };
};

/**
 * 简化的音乐播放器状态 Hook（只读）
 */
export const useMusicPlayerState = () => {
  return useAtomValue(musicPlayerAtom);
};
