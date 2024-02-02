'use client';

import { ThemeProvider } from 'next-themes';
import type { PropsWithChildren } from 'react';

import { ConfigProvider } from './config-provider';
import { ReactQueryProvider } from './react-query-provider';
import { JotaiProvider } from './jotai-provider';

export const AppProviders = ({ children }: PropsWithChildren) => {
  return (
    <ReactQueryProvider>
      <JotaiProvider>
        <ThemeProvider
          attribute="class"
          storageKey="blog-theme"
          defaultTheme="light"
        >
          <ConfigProvider>{children}</ConfigProvider>
        </ThemeProvider>
      </JotaiProvider>
    </ReactQueryProvider>
  );
};
