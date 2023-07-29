import { useMount } from 'ahooks';
import { useRef } from 'react';

export default function useMountedRef() {
  const isMounted = useRef(false);

  useMount(() => {
    isMounted.current = true;
  });

  return isMounted;
}
