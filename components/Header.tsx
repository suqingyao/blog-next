'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const DarkToggle = dynamic(() => import('./DarkToggle'), { ssr: false });

const links = [
  {
    label: 'Home',
    path: '/'
  },
  {
    label: 'Posts',
    path: '/posts'
  }
];

export default function Header() {
  const pathname = usePathname();

  const [activeIndex, setActiveIndex] = useState(0);

  const activeLineLeft = useMemo(() => {
    return activeIndex * 5;
  }, [activeIndex]);

  return (
    <header className="fixed left-0 top-0 z-50 flex h-[60px] w-full items-center px-5 text-center shadow-sm backdrop-blur-sm">
      <div className="relative ml-auto flex h-full items-center">
        {links.map((link, index) => (
          <Link
            href={`${link.path}`}
            key={link.path}
            className={cn(
              'flex h-full w-20 cursor-pointer items-center justify-center hover:text-primary',
              pathname === link.path && 'text-primary'
            )}
            onClick={() => setActiveIndex(index)}
          >
            {link.label}
          </Link>
        ))}
        <div
          className="absolute bottom-0 h-1 w-20 rounded-full bg-primary transition-all"
          style={{ left: `${activeLineLeft}rem` }}
        />
      </div>
      <DarkToggle />
    </header>
  );
}
