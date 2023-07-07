'use client';

import React from 'react';
import NextProgressbar from 'nextjs-progressbar';
import { ThemeProvider } from 'next-themes';
import Header from './Header';
import Footer from './Footer';
import Plum from './Plum';

export default function AppMain({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <NextProgressbar
        color="var(--primary-color)"
        options={{ showSpinner: false }}
      />
      <ThemeProvider attribute="">
        <Header />
        {children}
        <Footer />
        <Plum />
      </ThemeProvider>
    </>
  );
}
