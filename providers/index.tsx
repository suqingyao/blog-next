'use client';

import type { PropsWithChildren } from 'react';
import { ThemeProvider } from 'next-themes';
import { AnimatePresence } from 'framer-motion';

import { ConfigProvider } from './ConfigProvider';
import { ReactQueryProvider } from './ReactQueryProvider';
import { JotaiProvider } from './JotaiProvider';

export default function Providers({ children }: PropsWithChildren) {
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
}
