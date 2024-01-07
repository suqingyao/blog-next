import type { FC, PropsWithChildren } from 'react';
import { Provider, getDefaultStore } from 'jotai';

const store = getDefaultStore();

export const JotaiProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};
