'use client';

import { m } from 'motion/react';
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
    icon: 'i-mingcute-home-2-line',
  },
  {
    label: 'Posts',
    path: '/posts',
    icon: 'i-mingcute-quill-pen-line',
  },
  {
    label: 'Tags',
    path: '/tags',
    icon: 'i-mingcute-tag-line',
  },
  {
    label: 'Photos',
    path: '/photos',
    icon: 'i-mingcute-camera-line',
  },
  {
    label: 'Map',
    path: '/map',
    icon: 'i-mingcute-map-pin-line',
  },
];

export function AppHeader() {
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
    <header className="h-12 fixed left-0 right-0 top-0 z-100 flex items-center px-5 text-center">
      <div className="ml-auto flex items-center">
        {showPageTitle && (
          <m.h2
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
          </m.h2>
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
    </header>
  );
}
