'use client';

import type { DockItemData } from '@/components/ui/dock';
import { useTheme } from 'next-themes';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { Dock as DockPrimitive } from '@/components/ui/dock';
import { useIsDark } from '@/hooks/use-dark-mode';
import { cn } from '@/lib/utils';

const navigationLinks = [
  {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'i-mingcute-home-2-line',
    iconActive: 'i-mingcute-home-2-fill',
  },
  {
    id: 'posts',
    label: 'Posts',
    path: '/posts',
    icon: 'i-mingcute-quill-pen-line',
    iconActive: 'i-mingcute-quill-pen-fill',
  },
  {
    id: 'tags',
    label: 'Tags',
    path: '/tags',
    icon: 'i-mingcute-tag-line',
    iconActive: 'i-mingcute-tag-fill',
  },
  {
    id: 'photos',
    label: 'Photos',
    path: '/photos',
    icon: 'i-mingcute-camera-line',
    iconActive: 'i-mingcute-camera-fill',
  },
  {
    id: 'map',
    label: 'Map',
    path: '/map',
    icon: 'i-mingcute-map-pin-line',
    iconActive: 'i-mingcute-map-pin-fill',
  },
];

export function Dock() {
  const router = useRouter();
  const pathname = usePathname();
  const { setTheme } = useTheme();
  const isDark = useIsDark();

  const dockItems = useMemo<DockItemData[]>(() => {
    const items: DockItemData[] = [];

    // Navigation links
    navigationLinks.forEach((link) => {
      const isActive = pathname === link.path || (link.path !== '/' && pathname.startsWith(link.path));

      items.push({
        icon: (
          <i
            className={cn(
              isActive ? link.iconActive : link.icon,
              'transition-colors',
              isActive ? 'text-primary' : 'text-base-content/80',
            )}
            style={{ fontSize: '100%' }}
          />
        ),
        label: link.label,
        onClick: () => router.push(link.path),
        className: isActive ? 'ring-2 ring-primary/40' : '',
      });
    });

    // Divider
    items.push({
      icon: (
        <div
          className="h-8 w-px"
          style={{ backgroundColor: 'var(--color-base-300)' }}
        />
      ),
      label: '',
      onClick: () => {},
      className: 'cursor-default pointer-events-none',
    });

    // Theme Toggle
    items.push({
      icon: (
        <i
          className={cn(
            isDark ? 'i-mingcute-sun-line' : 'i-mingcute-moon-line',
            'transition-all text-base-content/80',
          )}
          style={{ fontSize: '100%' }}
        />
      ),
      label: 'Theme',
      onClick: () => {
        setTheme(isDark ? 'light' : 'dark');
      },
      className: '',
    });

    // Search Button
    items.push({
      icon: (
        <i
          className="i-mingcute-search-line text-base-content/80"
          style={{ fontSize: '100%' }}
        />
      ),
      label: 'Search',
      onClick: () => {
      },
      className: '',
    });

    return items;
  }, [pathname, router, setTheme, isDark]);

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-100 pointer-events-none">
        <div className="pointer-events-auto">
          <DockPrimitive
            items={dockItems}
            magnification={76}
            distance={200}
            baseItemSize={28}
            panelHeight={52}
          />
        </div>
      </div>
    </>
  );
}
