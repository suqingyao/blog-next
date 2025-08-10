import { useEffect } from 'react';

export function useUnmount(fn: () => void) {
  useEffect(() => {
    return () => {
      fn?.();
    };
  }, []);
}
