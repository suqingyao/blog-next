'use client';

import React from 'react';
import NextProgressbar from 'nextjs-progressbar';
import { ThemeProvider } from 'next-themes';
import Header from './Header';
import Footer from './Footer';
import Plum from './Plum';

export default function AppMain({ children }: { children?: React.ReactNode }) {
  return (
    <div
      className="
        mx-auto
        w-[75ch]
      "
    >
      <NextProgressbar color="#fb7299" options={{ showSpinner: false }} />
      <ThemeProvider attribute="class">
        <Header />
        {children}
        <Footer />
        <Plum />
      </ThemeProvider>
    </div>
  );
}
