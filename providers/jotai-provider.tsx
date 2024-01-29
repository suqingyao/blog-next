'use client';

import { Provider, createStore } from 'jotai';
import type { FC, PropsWithChildren } from 'react';

const store = createStore();

export const JotaiProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};
