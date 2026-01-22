import { atom } from 'jotai';

// Safe window access for SSR
function getWindowDimensions() {
  if (typeof window === 'undefined') {
    // Default values for SSR
    return { innerWidth: 1024, innerHeight: 768 };
  }
  return { innerWidth: window.innerWidth, innerHeight: window.innerHeight };
}

const { innerWidth: w, innerHeight: h } = getWindowDimensions();
const sm = w >= 640;
const md = w >= 768;
const lg = w >= 1024;
const xl = w >= 1280;
const _2xl = w >= 1536;

export const viewportAtom = atom({
  /**
   * 640px
   */
  sm,

  /**
   * 768px
   */
  md,

  /**
   * 1024px
   */
  lg,

  /**
   * 1280px
   */
  xl,

  /**
   * 1536px
   */
  '2xl': _2xl,

  h,
  w,
});
