'use client';

import { useEffect, useState } from 'react';
import { TbCircleArrowUpFilled } from 'react-icons/tb';
import { cn } from '@/lib/utils';

export const BackTop = () => {
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
        `
        fixed
        bottom-10
        right-10
        z-[9999]
        cursor-pointer
        rounded-full
        opacity-0
        drop-shadow-sm
        transition
      `,
        show && 'animate-bounce-enter-in opacity-100',
        !show && 'pointer-events-none animate-bounce-leave-out'
      )}
    >
      <TbCircleArrowUpFilled size={32} />
    </div>
  );
};
