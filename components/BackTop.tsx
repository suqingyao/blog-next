'use client';

import { useEffect, useState } from 'react';
import { TbCircleArrowUpFilled } from 'react-icons/tb';
import { cn } from '@/lib/utils';

export default function BackTop() {
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
      onClick={scrollTop}
      className={cn(
        `
        fixed
        bottom-10
        right-10
        cursor-pointer
        rounded-full
        text-primary/90
        opacity-0
        drop-shadow-sm
        transition-all
        hover:text-primary/80
        dark:hover:text-primary/60
      `,
        show && 'opacity-100',
        !show && 'pointer-events-none'
      )}
    >
      <TbCircleArrowUpFilled size={32} />
    </div>
  );
}
