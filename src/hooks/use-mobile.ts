import { useViewport } from './use-viewport';

export function useMobile() {
  return useViewport(v => v.w < 1024 && v.w !== 0);
}

export function isMobile() {
  // SSR safe: check if window exists
  if (typeof window === 'undefined') {
    return false; // Default to desktop during SSR
  }
  const w = window.innerWidth;
  return w < 1024 && w !== 0;
}
