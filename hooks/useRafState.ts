import { useCallback, useRef, useState } from 'react';
import { useUnmount } from './useUnmount';

export const useRafState = <S>(initialState?: S | (() => S)) => {
  const ref = useRef(0);
  const [state, setState] = useState(initialState);

  const setRafState = useCallback((value: S | ((prevState: S) => S)) => {
    cancelAnimationFrame(ref.current);

    ref.current = requestAnimationFrame(() => {
      setState(value);
    });
  }, []);

  useUnmount(() => cancelAnimationFrame(ref.current));

  return [state, setRafState] as const;
};
