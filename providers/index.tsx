'use client';

import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { ReactQueryProvider } from './react-query-provider';
import { JotaiProvider } from './jotai-provider';

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReactQueryProvider>
      <JotaiProvider>
        <NextThemeProvider
          attribute="class"
          storageKey="blog-theme"
          defaultTheme="light"
        >
          {children}
        </NextThemeProvider>
      </JotaiProvider>
    </ReactQueryProvider>
  );
};
