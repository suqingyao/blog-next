'use client';

import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

export const Backtop = () => {
  const [show, setShow] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 100) {
      setShow(true);
    } else {
      setShow(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div
      role="button"
      onClick={scrollTop}
      className={cn(
        `fixed right-10 bottom-10 z-[9999] cursor-pointer rounded-full opacity-0 drop-shadow-sm transition`,
        show && 'animate-bounce-enter-in opacity-100',
        !show && 'animate-bounce-leave-out pointer-events-none'
      )}
    >
      <span className="i-mingcute-arrow-up-circle-fill text-3xl" />
    </div>
  );
};
