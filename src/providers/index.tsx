'use client';

import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { JotaiProvider } from './jotai-provider';
import { ReactQueryProvider } from './react-query-provider';

export function AppProviders({ children }: { children: React.ReactNode }) {
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
}
