import type { Dispatch, SetStateAction } from 'react';
import { useCallback, useRef, useState } from 'react';
import { useUnmount } from './use-unmount';

interface useRafStateReturnType {
  <S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
  <S = undefined>(): [S | undefined, Dispatch<SetStateAction<S | undefined>>];
}

export const useRafState: useRafStateReturnType = <S>(initialState?: S | (() => S)) => {
  const ref = useRef(0);
  const [state, setState] = useState(initialState);

  const setRafState = useCallback(
    (value: S | undefined | ((prevState?: S | undefined) => S | undefined)) => {
      cancelAnimationFrame(ref.current);

      ref.current = requestAnimationFrame(() => setState(value));
    },
    [],
  );

  useUnmount(() => {
    cancelAnimationFrame(ref.current);
  });

  return [state, setRafState] as [
    S | undefined,
    Dispatch<SetStateAction<S | undefined>>,
  ];
};
