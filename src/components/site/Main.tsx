'use client';

import { useSetAtom } from 'jotai';
import { useEffect, useRef } from 'react';
import { scrollContainerRefAtom } from '@/store/atoms/app';
import { Dock } from './Dock';
import { Footer } from './Footer';

export function Main({ children }: { children: React.ReactNode }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const setScrollContainerRef = useSetAtom(scrollContainerRefAtom);

  useEffect(() => {
    setScrollContainerRef(scrollContainerRef.current);
  }, [setScrollContainerRef]);

  return (
    <div className="flex h-screen flex-col items-center overflow-hidden">
      <div
        ref={scrollContainerRef}
        className="w-full flex-1 overflow-y-auto scroll-smooth"
      >
        <div className="w-full flex-1">
          {children}
        </div>
        <Footer />
      </div>
      {/* 添加底部 Dock */}
      <Dock />
    </div>
  );
}
