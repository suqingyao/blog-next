'use client';

import { AnimatePresence, m, useMotionTemplate, useMotionValue } from 'motion/react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { memo, useCallback, useEffect } from 'react';
import { SearchButton } from '@/components/search/SearchButton';
import { AnimatedLogo } from '@/components/site/AnimatedLogo';
import { useIsDark } from '@/hooks/use-dark-mode';
import { useHeaderBgOpacity, useHeaderVisible, useMenuOpacity, useScrollDirection, useScrollY } from '@/hooks/use-scroll';
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
    label: '首页',
    path: '/',
    icon: 'i-mingcute-home-2-line',
  },
  {
    id: 'posts',
    label: '文章',
    path: '/posts',
    icon: 'i-mingcute-quill-pen-line',
  },
  {
    id: 'tags',
    label: '标签',
    path: '/tags',
    icon: 'i-mingcute-tag-line',
  },
  {
    id: 'photos',
    label: '照片',
    path: '/photos',
    icon: 'i-mingcute-camera-line',
  },
  {
    id: 'map',
    label: '地图',
    path: '/map',
    icon: 'i-mingcute-map-pin-line',
  },
];

// Header container (Shiro 风格：无背景色，只在顶部固定)
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

// Shiro 样式：Header 本身无背景，只在需要时显示模糊背景
const BlurredBackground = memo(() => {
  const bgOpacity = useHeaderBgOpacity();
  const shouldShow = bgOpacity > 0;

  if (!shouldShow)
    return null;

  return (
    <m.div
      className="absolute inset-0 -z-10 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: bgOpacity }}
      transition={{ duration: 0.2 }}
    />
  );
});

BlurredBackground.displayName = 'BlurredBackground';

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

  return (
    <div className="relative z-10 flex items-center gap-1">
      {/* Search */}
      <div className="hidden sm:block">
        <SearchButton />
      </div>

      {/* Theme Toggle */}
      <button
        type="button"
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        className={cn(
          'flex size-9 items-center justify-center rounded-full',
          'transition-colors duration-200',
          'hover:bg-gray-100 dark:hover:bg-gray-800',
        )}
        title="切换主题"
      >
        <i className={cn(
          isDark ? 'i-mingcute-sun-line' : 'i-mingcute-moon-line',
          'text-lg text-gray-600 dark:text-gray-400',
        )}
        />
      </button>

      {/* Mobile: Search icon button */}
      <button
        type="button"
        onClick={() => {
          // Trigger search modal on mobile
          const searchBtn = document.querySelector('[aria-label="搜索文章"]') as HTMLButtonElement;
          searchBtn?.click();
        }}
        className={cn(
          'flex size-9 items-center justify-center rounded-full sm:hidden',
          'transition-colors duration-200',
          'hover:bg-gray-100 dark:hover:bg-gray-800',
        )}
        title="搜索"
      >
        <i className="i-mingcute-search-line text-lg text-gray-600 dark:text-gray-400" />
      </button>
    </div>
  );
});

HeaderActions.displayName = 'HeaderActions';

export const Header = memo(() => {
  // Debug panel
  const scrollY = useScrollY();
  const direction = useScrollDirection();
  const isVisible = useHeaderVisible();
  const bgOpacity = useHeaderBgOpacity();
  const menuOpacity = useMenuOpacity();

  return (
    <>
      <HeaderWithShadow>
        <BlurredBackground />
        <div className="relative mx-auto grid h-full max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-4 lg:px-8">
          {/* Left: Logo */}
          <HeaderLogo />

          {/* Center: Navigation */}
          <HeaderNav />

          {/* Right: Actions */}
          <HeaderActions />
        </div>
      </HeaderWithShadow>

      {/* Debug Panel - 临时调试用，后续可删除 */}
      <div className="fixed right-4 top-20 z-[999] rounded-lg bg-black/90 p-4 font-mono text-xs text-white shadow-lg">
        <div className="space-y-1">
          <div>
            Scroll Y:
            <span className="text-green-400">
              {scrollY.toFixed(0)}
              px
            </span>
          </div>
          <div>
            Direction:
            <span className="text-blue-400">{direction || 'none'}</span>
          </div>
          <div>
            Header Visible:
            <span className={isVisible ? 'text-green-400' : 'text-red-400'}>{isVisible ? 'YES' : 'NO'}</span>
          </div>
          <div>
            BG Opacity:
            <span className="text-yellow-400">
              {(bgOpacity * 100).toFixed(0)}
              %
            </span>
          </div>
          <div>
            Menu Opacity:
            <span className="text-purple-400">
              {(menuOpacity * 100).toFixed(0)}
              %
            </span>
          </div>
        </div>
      </div>
    </>
  );
});

Header.displayName = 'Header';
