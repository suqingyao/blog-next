'use client';

import { createStore, Provider } from 'jotai';

const store = createStore();

export function JotaiProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
