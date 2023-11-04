'use client';

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { BsArrowUpCircleFill } from 'react-icons/bs';

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
        text-primary
        opacity-0
        transition-opacity
      `,
        show && 'opacity-100',
        !show && 'pointer-events-none'
      )}
    >
      <BsArrowUpCircleFill size={32} />
    </div>
  );
}
