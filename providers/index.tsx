'use client';

import type { PropsWithChildren } from 'react';
import { ThemeProvider } from 'next-themes';
import { AnimatePresence } from 'framer-motion';

import { ConfigProvider } from './config-provider';
import { ReactQueryProvider } from './react-query-provider';
import { JotaiProvider } from './jotai-provider';

export const AppProviders = ({ children }: PropsWithChildren) => {
  return (
    <ReactQueryProvider>
      <JotaiProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
        >
          <AnimatePresence mode="wait">
            <ConfigProvider>{children}</ConfigProvider>
          </AnimatePresence>
        </ThemeProvider>
      </JotaiProvider>
    </ReactQueryProvider>
  );
};
