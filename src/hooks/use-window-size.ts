import { useEffect } from 'react';
import { isBrowser } from '../lib/is';
import { useRafState } from './use-raf-state';

export const useWindowSize = (
  initialWidth = Infinity,
  initialHeight = Infinity
) => {
  const [state, setState] = useRafState<{
    width: number;
    height: number;
  }>({
    width: isBrowser ? window.innerWidth : initialWidth,
    height: isBrowser ? window.innerHeight : initialHeight
  });

  useEffect(() => {
    if (isBrowser) {
      const handler = () => {
        setState({
          width: window.innerWidth,
          height: window.innerHeight
        });
      };
      window.addEventListener('resize', handler);

      return () => window.removeEventListener('resize', handler);
    }
  }, []);

  return state;
};
