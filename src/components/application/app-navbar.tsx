'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';

import { cn } from '@/lib/utils';
import { useHeaderAtom } from '@/hooks/use-header-atom';
import { useScrollTop } from '@/hooks/use-scroll-top';
import { APP_HEADER_HEIGHT } from '@/constants';

const links = [
  {
    label: 'Portfolio',
    path: '/',
    icon: 'i-mingcute-home-5-fill'
  },
  {
    label: 'Posts',
    path: '/posts',
    icon: 'i-mingcute-notebook-2-fill'
  },
  {
    label: 'Photos',
    path: '/photos',
    icon: 'i-mingcute-camera-2-ai-fill'
  }
];

export const AppNavbar = () => {
  const pathname = usePathname();

  const { headerAtom } = useHeaderAtom();

  const scrollTop = useScrollTop();

  const showPageTitle = useMemo(
    () => scrollTop > APP_HEADER_HEIGHT,
    [scrollTop]
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
      ease: 'easeInOut'
    }
  };

  return (
    <div className="ml-auto flex items-center">
      {showPageTitle && (
        <motion.h2
          variants={floatingTitleVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="fixed -translate-y-1/2 truncate font-sans text-[1.2rem] font-medium leading-normal"
          style={{
            left: fixedLeft + 'px'
          }}
        >
          {headerAtom.pageTitle}
        </motion.h2>
      )}
      <nav className="mr-4 flex h-full items-center gap-4">
        {links.map((link) => (
          <Link
            href={`${link.path}`}
            key={link.path}
            className={cn(
              'flex cursor-pointer items-center justify-center p-2',
              pathname === link.path && 'text-primary'
            )}
          >
            <i className={cn(link.icon, 'text-xl')}></i>
          </Link>
        ))}
      </nav>
    </div>
  );
};
