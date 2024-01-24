import { useRef } from 'react';
import { useMount } from './use-mount';

export default function useMountedRef() {
  const isMounted = useRef(false);

  useMount(() => {
    isMounted.current = true;
  });

  return isMounted;
}
