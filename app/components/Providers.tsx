'use client';

import { ThemeProvider } from 'next-themes';
import { type PropsWithChildren } from 'react';
import ConfigProvider from './ConfigProvider';

export default function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <ConfigProvider>{children}</ConfigProvider>
    </ThemeProvider>
  );
}
