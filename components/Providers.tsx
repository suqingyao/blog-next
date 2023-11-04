'use client';

import { ThemeProvider } from 'next-themes';
import { type PropsWithChildren } from 'react';
import ConfigProvider from './ConfigProvider';
import { AnimatePresence } from 'framer-motion';

export default function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <AnimatePresence mode="wait">
        <ConfigProvider>{children}</ConfigProvider>
      </AnimatePresence>
    </ThemeProvider>
  );
}
