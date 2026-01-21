// Safe SSR-compatible WebGL detection
export const canUseWebGL = (() => {
  if (typeof document === 'undefined') {
    return false; // No WebGL during SSR
  }

  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl');
    return gl !== null;
  }
  catch {
    return false;
  }
})();
