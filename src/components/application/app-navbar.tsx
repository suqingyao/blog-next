'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { useMemo } from 'react';

import { SearchButton } from '@/components/search';
import { ThemeToggle } from '@/components/ui/dark-toggle/ThemeToggle';
import { APP_HEADER_HEIGHT } from '@/constants';
import { useScrollTop } from '@/hooks/use-scroll-top';
import { cn } from '@/lib/utils';
import { useHeaderAtom } from '@/store/hooks/use-header-atom';

const links = [
  {
    label: 'Portfolio',
    path: '/',
    icon: 'i-ri-home-2-line',
  },
  {
    label: 'Posts',
    path: '/posts',
    icon: 'i-ri-file-list-2-line',
  },
  {
    label: 'Tags',
    path: '/tags',
    icon: 'i-ri-price-tag-3-line',
  },
  {
    label: 'Photos',
    path: '/photos',
    icon: 'i-ri-camera-2-line',
  },
  {
    label: 'Map',
    path: '/map',
    icon: 'i-ri-map-2-line',
  },
];

export function AppNavbar() {
  const { headerAtom } = useHeaderAtom();

  const scrollTop = useScrollTop();

  const showPageTitle = useMemo(
    () => scrollTop > APP_HEADER_HEIGHT,
    [scrollTop],
  );

  const fixedLeft = useMemo(() => {
    return headerAtom.pageTitleElement?.getBoundingClientRect().left ?? 0;
  }, [headerAtom]);

  const floatingTitleVariants = {
    initial: { opacity: 0, top: 60 },
    animate: { opacity: 1, top: 30 },
    exit: { opacity: 0, top: 60 },
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  };

  return (
    <div className="ml-auto flex items-center">
      {showPageTitle && (
        <motion.h2
          variants={floatingTitleVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="fixed -translate-y-1/2 truncate font-sans text-[1.2rem] leading-normal font-medium"
          style={{
            left: `${fixedLeft}px`,
          }}
        >
          {headerAtom.pageTitle}
        </motion.h2>
      )}
      <nav className="mr-4 flex h-full items-center gap-4">
        {links.map(link => (
          <Link
            href={link.path}
            key={link.path}
            className="flex cursor-pointer items-center justify-center p-2 transition-colors hover:text-primary"
          >
            <i className={cn(link.icon, 'text-xl')}></i>
          </Link>
        ))}
        <ThemeToggle />
        <SearchButton />
      </nav>
    </div>
  );
}
