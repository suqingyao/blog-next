'use client';

import { useAtomValue } from 'jotai';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { scrollContainerRefAtom } from '@/store/atoms/app';

export function Backtop() {
  const [show, setShow] = useState(false);
  const scrollContainer = useAtomValue(scrollContainerRefAtom);

  useEffect(() => {
    const target = scrollContainer ?? window;

    const handleScroll = () => {
      const scrollY = target instanceof Window ? target.scrollY : (target as HTMLElement | null)?.scrollTop || 0;
      if (scrollY > 100) {
        setShow(true);
      }
      else {
        setShow(false);
      }
    };

    target.addEventListener('scroll', handleScroll);

    return () => target.removeEventListener('scroll', handleScroll);
  }, [scrollContainer]);

  const scrollTop = () => {
    if (scrollContainer) {
      scrollContainer.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      return;
    }

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div
      role="button"
      onClick={scrollTop}
      className={cn(
        'fixed right-10 bottom-15 z-9999 cursor-pointer rounded-full drop-shadow-sm opacity-0 transition-all duration-300',
        show && 'pointer-events-auto animate-in slide-in-from-bottom-20 opacity-100',
        !show && 'pointer-events-none animate-out slide-out-to-bottom-24',
      )}
    >
      <span className="i-mingcute-arrow-up-circle-fill text-3xl" />
    </div>
  );
}
