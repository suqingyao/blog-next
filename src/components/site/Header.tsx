'use client';

import { m, useMotionTemplate, useMotionValue } from 'motion/react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { memo, useCallback, useEffect } from 'react';
import { openSearchModal } from '@/components/search/SearchModal';
import { AnimatedLogo } from '@/components/site/AnimatedLogo';
import { useIsDark } from '@/hooks/use-dark-mode';
import { useHeaderVisible, useMenuOpacity } from '@/hooks/use-scroll';
import { useSearchHotkey } from '@/hooks/use-search-hotkey';
import { cn } from '@/lib/utils';

interface NavigationLink {
  id: string;
  label: string;
  path: string;
  icon?: string;
}

const navigationLinks: NavigationLink[] = [
  {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'i-mingcute-home-2-line',
  },
  {
    id: 'posts',
    label: 'Posts',
    path: '/posts',
    icon: 'i-mingcute-quill-pen-line',
  },
  {
    id: 'tags',
    label: 'Tags',
    path: '/tags',
    icon: 'i-mingcute-tag-line',
  },
  {
    id: 'photos',
    label: 'Photos',
    path: '/photos',
    icon: 'i-mingcute-camera-line',
  },
  {
    id: 'explore',
    label: 'Explore',
    path: '/explore',
    icon: 'i-mingcute-map-pin-line',
  },
];

const HeaderWithShadow = memo<{ children: React.ReactNode }>(({ children }) => {
  const isVisible = useHeaderVisible();

  // Debug: 使用 useEffect 打印状态
  useEffect(() => {
    console.log('Header状态:', { isVisible });
  }, [isVisible]);

  return (
    <m.header
      animate={{
        y: isVisible ? 0 : '-100%',
      }}
      transition={{
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={cn(
        'fixed inset-x-0 top-0 z-50 h-[4.5rem]',
      )}
    >
      {children}
    </m.header>
  );
});

HeaderWithShadow.displayName = 'HeaderWithShadow';
// Logo area
const HeaderLogo = memo(() => {
  return (
    <div className="relative z-10 flex items-center">
      <AnimatedLogo />
    </div>
  );
});

HeaderLogo.displayName = 'HeaderLogo';

// Navigation item component
interface NavItemProps {
  href: string;
  isActive: boolean;
  children: React.ReactNode;
  icon?: string;
}

const NavItem = memo<NavItemProps>(({ href, isActive, children, icon }) => {
  return (
    <div>
      <Link
        href={href}
        className={cn(
          'relative block whitespace-nowrap px-4 py-2 transition',
          isActive ? 'text-accent' : 'hover:text-accent/80',
        )}
      >
        <span className="relative flex items-center">
          {isActive && icon && (
            <m.span
              layoutId="header-menu-icon"
              className="mr-2 flex items-center"
            >
              <i className={cn(icon)} />
            </m.span>
          )}
          <m.span layout>{children}</m.span>
        </span>

        {/* Active indicator */}
        {isActive && (
          <m.span
            className={cn(
              'absolute inset-x-1 -bottom-px h-px',
              'bg-gradient-to-r from-accent/0 via-accent/70 to-accent/0',
            )}
            layoutId="active-nav-item"
          />
        )}
      </Link>
    </div>
  );
});

NavItem.displayName = 'NavItem';

// Navigation menu
const HeaderNav = memo(() => {
  const pathname = usePathname();
  const menuOpacity = useMenuOpacity();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const radius = useMotionValue(0);

  const handleMouseMove = useCallback(
    ({ clientX, clientY, currentTarget }: React.MouseEvent) => {
      const bounds = currentTarget.getBoundingClientRect();
      mouseX.set(clientX - bounds.left);
      mouseY.set(clientY - bounds.top);
      radius.set(Math.hypot(bounds.width, bounds.height) / 2.5);
    },
    [mouseX, mouseY, radius],
  );

  const background = useMotionTemplate`radial-gradient(${radius}px circle at ${mouseX}px ${mouseY}px, var(--spotlight-color) 0%, transparent 65%)`;

  // 根据透明度决定是否隐藏背景（Shiro 风格）
  const shouldHideNavBg = menuOpacity === 0;

  return (
    <nav className="flex items-center justify-center">
      <m.div
        layout="size"
        onMouseMove={handleMouseMove}
        style={{
          opacity: menuOpacity,
          visibility: menuOpacity === 0 ? 'hidden' : 'visible',
        }}
        className={cn(
          'group relative',
          'hidden md:flex items-center',
          'rounded-full',
          'bg-gradient-to-b from-zinc-50/70 to-white/90',
          'shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5',
          'backdrop-blur-md',
          'dark:from-zinc-900/70 dark:to-zinc-800/90 dark:ring-zinc-100/10',
          '[--spotlight-color:oklch(var(--a)_/_0.12)]',
          'pointer-events-auto duration-200',
          shouldHideNavBg && '!bg-none !shadow-none !ring-transparent',
        )}
      >
        {/* Spotlight overlay */}
        <m.div
          className="pointer-events-none absolute -inset-px rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background }}
          aria-hidden="true"
        />

        <div className="flex items-center px-4 text-sm font-medium text-zinc-800 dark:text-zinc-200">
          {navigationLinks.map((link) => {
            const isActive = pathname === link.path
              || (link.path !== '/' && pathname.startsWith(link.path));

            return (
              <NavItem
                key={link.id}
                href={link.path}
                isActive={isActive}
                icon={link.icon}
              >
                {link.label}
              </NavItem>
            );
          })}
        </div>
      </m.div>
    </nav>
  );
});

HeaderNav.displayName = 'HeaderNav';

// Header actions (search, theme toggle, etc.)
const HeaderActions = memo(() => {
  const { setTheme } = useTheme();
  const isDark = useIsDark();

  const handleOpenSearch = useCallback(() => {
    openSearchModal();
  }, []);

  // 注册全局快捷键
  useSearchHotkey(handleOpenSearch);

  return (
    <div className="relative z-10 flex items-center gap-2">
      {/* Search Button */}
      <button
        type="button"
        onClick={handleOpenSearch}
        className={cn(
          'hidden sm:flex items-center gap-2',
          'rounded-xl px-3 py-2 text-sm',
          'bg-white/60 text-slate-700',
          'border border-slate-200/50',
          'shadow-sm shadow-black/5',
          'backdrop-blur-sm',
          'transition-all duration-200',
          'hover:scale-105 hover:bg-white/80',
          'active:scale-95',
          'dark:bg-white/10 dark:text-white',
          'dark:border-white/20',
          'dark:shadow-black/20',
          'dark:hover:bg-white/15',
        )}
        aria-label="搜索文章"
      >
        <i className="i-mingcute-search-line h-4 w-4" />
        <span>Search</span>
        <kbd className="flex items-center rounded border border-slate-300/50 bg-slate-100/80 px-2 py-0.5 font-mono text-xs dark:border-white/20 dark:bg-white/10">
          ⌘K
        </kbd>
      </button>

      {/* Theme Toggle */}
      <button
        type="button"
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        className={cn(
          'flex items-center justify-center',
          'size-9 rounded-full',
          'bg-white/60 text-slate-700',
          'border border-slate-200/50',
          'shadow-sm shadow-black/5',
          'backdrop-blur-sm',
          'transition-all duration-200',
          'hover:scale-110 hover:bg-white/80',
          'active:scale-95',
          'dark:bg-white/10 dark:text-white',
          'dark:border-white/20',
          'dark:shadow-black/20',
          'dark:hover:bg-white/15',
        )}
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <i
          className={cn(
            'h-5 w-5',
            isDark ? 'i-mingcute-sun-line' : 'i-mingcute-moon-line',
          )}
        />
      </button>

      {/* Mobile: Search icon button */}
      <button
        type="button"
        onClick={handleOpenSearch}
        className={cn(
          'flex sm:hidden items-center justify-center',
          'size-9 rounded-full',
          'bg-white/60 text-slate-700',
          'border border-slate-200/50',
          'shadow-sm shadow-black/5',
          'backdrop-blur-sm',
          'transition-all duration-200',
          'hover:scale-110 hover:bg-white/80',
          'active:scale-95',
          'dark:bg-white/10 dark:text-white',
          'dark:border-white/20',
          'dark:shadow-black/20',
          'dark:hover:bg-white/15',
        )}
        title="搜索"
      >
        <i className="i-mingcute-search-line h-5 w-5" />
      </button>
    </div>
  );
});

HeaderActions.displayName = 'HeaderActions';

export const Header = memo(() => {
  return (
    <HeaderWithShadow>
      <div className="relative mx-auto grid h-full max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-4 lg:px-8">
        {/* Left: Logo */}
        <HeaderLogo />

        {/* Center: Navigation */}
        <HeaderNav />

        {/* Right: Actions */}
        <HeaderActions />
      </div>
    </HeaderWithShadow>
  );
});

Header.displayName = 'Header';
