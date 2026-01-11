'use client';

import { Provider } from 'jotai';
import { jotaiStore } from '@/lib/jotai';

export function JotaiProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={jotaiStore}>{children}</Provider>;
}
