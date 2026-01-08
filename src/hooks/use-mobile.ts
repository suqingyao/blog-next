import { useViewport } from './use-viewport';

export function useMobile() {
  return useViewport(v => v.w < 1024 && v.w !== 0);
}

export function isMobile() {
  const w = window.innerWidth;
  return w < 1024 && w !== 0;
}
