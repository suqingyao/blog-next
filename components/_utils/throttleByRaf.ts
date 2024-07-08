import { raf, caf } from '@/components/_utils/raf';

export function throttleByRaf(cb: (...args: unknown[]) => void) {
  let timer: null | number = null;

  const throttle = function (...args: unknown[]) {
    timer && caf(timer);
    timer = raf(() => {
      cb(...args);
      timer = null;
    });
  };

  throttle.cancel = () => {
    caf(timer);
    timer = null;
  };

  return throttle;
}
