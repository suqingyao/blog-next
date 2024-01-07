'use client';

import type { PropsWithChildren } from 'react';
import { ThemeProvider } from 'next-themes';
import { AnimatePresence } from 'framer-motion';

import ConfigProvider from './ConfigProvider';
import { TanQueryProvider } from './TanQueryProvider';

export default function Providers({ children }: PropsWithChildren) {
  return (
    <TanQueryProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
      >
        <AnimatePresence mode="wait">
          <ConfigProvider>{children}</ConfigProvider>
        </AnimatePresence>
      </ThemeProvider>
    </TanQueryProvider>
  );
}
