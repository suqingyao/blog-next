'use client';
import React, { FC } from 'react';
import { ThemeProvider } from 'next-themes';

interface ProviderProps {
  children: React.ReactNode;
}

const Provider: FC<ProviderProps> = ({ children }) => {
  return <ThemeProvider attribute="class">{children}</ThemeProvider>;
};

export default Provider;
