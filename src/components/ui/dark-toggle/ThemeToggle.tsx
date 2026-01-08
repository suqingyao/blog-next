'use client';

import { useTheme } from 'next-themes';
import { useMemo } from 'react';
import { flushSync } from 'react-dom';
import { useIsMounted } from '@/hooks/use-is-mounted';
import { transitionViewIfSupported } from '@/lib/dom';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const isDark = useMemo(() => resolvedTheme === 'dark', [resolvedTheme]);
  const isMounted = useIsMounted();

  const toggleTheme = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y),
    );

    const transition = transitionViewIfSupported(() => {
      // eslint-disable-next-line react-dom/no-flush-sync
      flushSync(() => {
        setTheme(isDark ? 'light' : 'dark');
      });
    });
    if (transition) {
      transition.ready.then(() => {
        const clipPath = [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ];
        document.documentElement.animate(
          {
            clipPath: isDark ? [...clipPath].reverse() : clipPath,
          },
          {
            duration: 400,
            easing: 'ease-out',
            pseudoElement: isDark
              ? '::view-transition-old(root)'
              : '::view-transition-new(root)',
          },
        );
      });
    }
  };

  if (!isMounted) {
    return (
      <button
        className="flex cursor-pointer items-center justify-center p-2 transition-colors hover:text-primary"
        type="button"
      >
        <i className="i-mingcute-sun-line text-xl opacity-0" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'flex cursor-pointer items-center justify-center p-2 transition-colors hover:text-primary',
      )}
      aria-label="Toggle theme"
      type="button"
    >
      <i
        className={cn(
          'text-xl transition-all duration-300',
          isDark
            ? 'i-mingcute-moon-line'
            : 'i-mingcute-sun-line rotate-90',
        )}
      />
    </button>
  );
}
