import { useRef } from 'react';

export function useRefValue<T>(value: () => T): T {
  // @ts-expect-error: 初始值可能为 undefined
  const ref = useRef<T>();

  if (!ref.current) {
    ref.current = value();
  }

  return ref.current;
}
