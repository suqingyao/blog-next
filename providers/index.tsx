'use client';

import { ThemeProvider } from 'next-themes';

import { ConfigProvider } from './config-provider';
import { ReactQueryProvider } from './react-query-provider';
import { JotaiProvider } from './jotai-provider';

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
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
