'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { useHeaderAtom } from '@/hooks/useHeaderAtom';
import { useScrollTop } from '@/hooks/useScrollTop';

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

export const Navbar = () => {
  const pathname = usePathname();

  const { headerAtom } = useHeaderAtom();

  const scrollTop = useScrollTop();

  const showPageTitle = useMemo(() => scrollTop > 60, [scrollTop]);

  const fixedLeft = useMemo(() => {
    return headerAtom.pageTitleElement?.getBoundingClientRect().left ?? 0;
  }, [headerAtom]);

  return (
    <div className="ml-auto flex items-center">
      {showPageTitle && (
        <motion.h2
          initial={{ opacity: 0, top: 60 }}
          animate={{ opacity: 1, top: 30 }}
          className="fixed -translate-y-1/2"
          style={{
            left: fixedLeft + 'px'
          }}
        >
          {headerAtom.pageTitle}
        </motion.h2>
      )}
      <nav className="flex h-full items-center">
        {links.map((link) => (
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
      </nav>
    </div>
  );
};
