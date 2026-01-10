'use client';

import { useIsMounted } from '@/hooks/use-is-mounted';

export function ClientOnly({ children }: { children?: React.ReactNode }) {
  const mounted = useIsMounted();

  return mounted ? children : null;
}
