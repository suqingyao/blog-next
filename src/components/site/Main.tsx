'use client';

import { useSetAtom } from 'jotai';
import { useEffect, useRef } from 'react';
import { useScrollListener } from '@/hooks/use-scroll';
import { scrollContainerRefAtom } from '@/store/atoms/app';
import { BackgroundGrid } from './BackgroundGrid';
import { Footer } from './Footer';
import { Header } from './Header';

export function Main({ children }: { children: React.ReactNode }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const setScrollContainerRef = useSetAtom(scrollContainerRefAtom);

  // 监听滚动位置
  useScrollListener(scrollContainerRef);

  useEffect(() => {
    setScrollContainerRef(scrollContainerRef.current);
  }, [setScrollContainerRef]);

  return (
    <div className="flex h-screen flex-col items-center overflow-hidden">
      {/* 顶部导航 */}
      <Header />

      <div
        ref={scrollContainerRef}
        className="w-full flex-1 overflow-y-auto scroll-smooth"
      >
        {/* 为固定 header 添加顶部间距 (h-[4.5rem]) */}
        <div className="w-full flex-1 pt-[4.5rem]">
          {children}
        </div>
        <Footer />
      </div>

      <BackgroundGrid />
    </div>
  );
}
