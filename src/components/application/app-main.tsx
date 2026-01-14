'use client';

import { useAtom } from 'jotai';
import { useEffect, useRef } from 'react';
import { scrollContainerRefAtom } from '@/store/atoms/app';
import { AppContent } from './app-content';
import { AppFooter } from './app-footer';
import { AppHeader } from './app-header';

export function AppMain({ children }: { children: React.ReactNode }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [, setScrollContainerRef] = useAtom(scrollContainerRefAtom);

  useEffect(() => {
    setScrollContainerRef(scrollContainerRef.current);
  }, [setScrollContainerRef]);

  return (
    <div className="flex h-screen flex-col items-center overflow-hidden">
      <AppHeader />
      <div
        ref={scrollContainerRef}
        className="mt-12 w-full flex-1 overflow-y-auto scroll-smooth"
      >
        <AppContent>{children}</AppContent>
        <AppFooter />
      </div>
    </div>
  );
}
