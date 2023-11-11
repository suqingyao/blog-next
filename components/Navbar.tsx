'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

const links = [
  {
    label: 'Home',
    path: '/',
    sort: 0
  },
  {
    label: 'Posts',
    path: '/posts',
    sort: 1
  }
];

const Navbar = () => {
  const pathname = usePathname();
  const activeIndex = useMemo(() => {
    let index = -1;

    links.some((link) => {
      if (pathname === link.path) {
        index = link.sort;
        return true;
      }
    });

    return index;
  }, [pathname]);

  const activeLineLeft = useMemo(() => {
    return activeIndex * 5;
  }, [activeIndex]);

  return (
    <nav className="relative ml-auto flex h-full items-center">
      {links.map((link, index) => (
        <Link
          href={`${link.path}`}
          key={link.path}
          className={cn(
            'flex h-full w-20 cursor-pointer items-center justify-center hover:text-primary',
            pathname === link.path && 'text-primary'
          )}
        >
          {link.label}
        </Link>
      ))}
      {/* <div
          className={cn(
            'absolute bottom-0 h-1 w-20 rounded-full bg-primary transition-all',
            activeIndex < 0 && 'hidden'
          )}
          style={{ left: `${activeLineLeft}rem` }}
        /> */}
    </nav>
  );
};

export default Navbar;
