'use client';

import type { FC, PropsWithChildren } from 'react';
import { Provider, createStore } from 'jotai';

const store = createStore();

export const JotaiProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};
