import { useRef } from 'react';

export function useRefValue<T>(value: () => T): T {
  // @ts-ignore
  const ref = useRef<T>();

  if (!ref.current) {
    ref.current = value();
  }

  return ref.current;
}
