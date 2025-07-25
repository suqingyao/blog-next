import { useEffect, useRef } from 'react';

export const useGetState = <T>(state: T): (() => T) => {
  const ref = useRef(state);

  useEffect(() => void (ref.current = state), [state]);
  return () => ref.current;
};
