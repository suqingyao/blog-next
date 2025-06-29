'use client';

import { useMemo } from 'react';
import Link from 'next/link';
// @ts-ignore
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';

import { cn } from '@/lib/utils';
import { useHeaderAtom } from '@/hooks/use-header-atom';
import { useScrollTop } from '@/hooks/use-scroll-top';

const links = [
  {
    label: 'Portfolio',
    path: '/'
  },
  {
    label: 'Posts',
    path: '/posts'
  }
];

export const AppNavbar = () => {
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
          className="fixed -translate-y-1/2 truncate font-sans text-[1.2rem] font-medium leading-normal"
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
              'hover:text-primary flex h-full w-20 cursor-pointer items-center justify-center',
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
