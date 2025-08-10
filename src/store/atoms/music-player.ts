import { atom } from 'jotai';
import { consoleLog } from '@/lib/console';

/**
 * 音乐曲目接口
 */
export interface MusicTrack {
  id: string;
  title: string;
  artist?: string;
  src: string;
  duration?: number;
}

/**
 * 播放器位置类型
 */
export type PlayerPosition = 'tl' | 'tr' | 'bl' | 'br';

export interface MusicPlayerState {
  playlist: MusicTrack[];
  currentIndex: number;
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  isLoading: boolean;
  needsUserInteraction: boolean;
  position: PlayerPosition;
  isDragging: boolean;
  dragOffset: { x: number; y: number };
}

/**
 * 初始状态
 */
const initialState: MusicPlayerState = {
  playlist: [],
  currentIndex: 0,
  currentTrack: null,
  isPlaying: false,
  volume: 0.7,
  isMuted: false,
  currentTime: 0,
  duration: 0,
  isLoading: false,
  needsUserInteraction: false,
  position: 'br',
  isDragging: false,
  dragOffset: { x: 0, y: 0 },
};

/**
 * 音乐播放器状态 atom
 */
export const musicPlayerAtom = atom<MusicPlayerState>(initialState);

/**
 * 切换播放/暂停状态
 */
export const togglePlayAtom = atom(null, (get, set) => {
  const state = get(musicPlayerAtom);
  set(musicPlayerAtom, {
    ...state,
    isPlaying: !state.isPlaying,
  });
});

/**
 * 设置当前播放时间
 */
export const setCurrentTimeAtom = atom(
  null,
  (get, set, currentTime: number) => {
    const state = get(musicPlayerAtom);
    set(musicPlayerAtom, {
      ...state,
      currentTime,
    });
  },
);

/**
 * 设置音量
 */
export const setVolumeAtom = atom(null, (get, set, volume: number) => {
  const state = get(musicPlayerAtom);
  set(musicPlayerAtom, {
    ...state,
    volume: Math.max(0, Math.min(1, volume)),
  });
});

/**
 * 切换静音状态
 */
export const toggleMuteAtom = atom(null, (get, set) => {
  const state = get(musicPlayerAtom);
  set(musicPlayerAtom, {
    ...state,
    isMuted: !state.isMuted,
  });
});

/**
 * 播放下一首
 */
export const playNextAtom = atom(null, (get, set) => {
  const state = get(musicPlayerAtom);
  const nextIndex = (state.currentIndex + 1) % state.playlist.length;
  const nextTrack = state.playlist[nextIndex];
  set(musicPlayerAtom, {
    ...state,
    currentIndex: nextIndex,
    currentTrack: nextTrack,
    currentTime: 0,
    duration: 0,
  });
});

/**
 * 播放上一首
 */
export const playPreviousAtom = atom(null, (get, set) => {
  const state = get(musicPlayerAtom);
  const prevIndex
    = state.currentIndex === 0
      ? state.playlist.length - 1
      : state.currentIndex - 1;
  const prevTrack = state.playlist[prevIndex];
  set(musicPlayerAtom, {
    ...state,
    currentIndex: prevIndex,
    currentTrack: prevTrack,
    currentTime: 0,
    duration: 0,
  });
});

/**
 * 选择指定索引的曲目
 */
export const selectTrackAtom = atom(null, (get, set, index: number) => {
  const state = get(musicPlayerAtom);
  if (index >= 0 && index < state.playlist.length) {
    const track = state.playlist[index];
    set(musicPlayerAtom, {
      ...state,
      currentIndex: index,
      currentTrack: track,
      currentTime: 0,
      duration: 0,
    });
  }
});

/**
 * 设置是否需要用户交互
 */
export const setNeedsUserInteractionAtom = atom(
  null,
  (get, set, needsUserInteraction: boolean) => {
    const state = get(musicPlayerAtom);
    set(musicPlayerAtom, {
      ...state,
      needsUserInteraction,
    });
  },
);

/**
 * 加载播放列表的 atom
 */
export const loadPlaylistAtom = atom(null, async (get, set) => {
  try {
    const response = await fetch('/api/music');
    if (!response.ok) {
      throw new Error('Failed to fetch music files');
    }

    const data = await response.json();
    const state = get(musicPlayerAtom);

    set(musicPlayerAtom, {
      ...state,
      playlist: data.tracks,
      currentTrack: data.tracks.length > 0 ? data.tracks[0] : null,
    });
  }
  catch (error) {
    consoleLog('ERROR', 'Error loading playlist:', error);
  }
});

/**
 * 设置播放器位置
 */
export const setPlayerPositionAtom = atom(
  null,
  (get, set, position: PlayerPosition) => {
    const state = get(musicPlayerAtom);
    set(musicPlayerAtom, {
      ...state,
      position,
    });
  },
);

/**
 * 设置拖拽状态
 */
export const setDraggingAtom = atom(null, (get, set, isDragging: boolean) => {
  const state = get(musicPlayerAtom);
  set(musicPlayerAtom, {
    ...state,
    isDragging,
  });
});

/**
 * 设置拖拽偏移量
 */
export const setDragOffsetAtom = atom(
  null,
  (get, set, dragOffset: { x: number; y: number }) => {
    const state = get(musicPlayerAtom);
    set(musicPlayerAtom, {
      ...state,
      dragOffset,
    });
  },
);
