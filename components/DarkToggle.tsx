'use client';

import { MouseEvent, useMemo } from 'react';
import { flushSync } from 'react-dom';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';

import useSound from '@/hooks/useSound';
import { transitionViewIfSupported } from '@/lib/dom';
import ClientOnly from './ClientOnly';

export default function DarkToggle() {
  const { theme = 'light', setTheme } = useTheme();
  const [playOn] = useSound('/sounds/switch.mp3');
  const [playOff] = useSound('/sounds/switch.mp3', { playbackRate: 0.6 });

  const isDark = useMemo(() => theme === 'dark', [theme]);

  const handleToggleTheme = (event: MouseEvent<HTMLDivElement>) => {
    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
    );

    const transition = transitionViewIfSupported(() => {
      flushSync(() => {
        setTheme(isDark ? 'light' : 'dark');
        isDark ? playOff() : playOn();
      });
    });
    if (transition) {
      transition.ready.then(() => {
        const clipPath = [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`
        ];
        document.documentElement.animate(
          {
            clipPath: isDark ? [...clipPath].reverse() : clipPath
          },
          {
            duration: 400,
            easing: 'ease-out',
            pseudoElement: isDark
              ? '::view-transition-old(root)'
              : '::view-transition-new(root)'
          }
        );
      });
    }
  };

  const starPaths = useMemo(() => {
    if (isDark)
      return [
        'M25 10L31.7523 28.2477L50 35L31.7523 41.7523L25 60L18.2477 41.7523L0 35L18.2477 28.2477L25 10Z',
        'M71.5 42L76.2266 54.7734L89 59.5L76.2266 64.2266L71.5 77L66.7734 64.2266L54 59.5L66.7734 54.7734L71.5 42Z',
        'M61 0L63.7009 7.29909L71 10L63.7009 12.7009L61 20L58.2991 12.7009L51 10L58.2991 7.29909L61 0Z'
      ];
    return [];
  }, [isDark]);

  const starts = (
    <svg
      className="absolute left-[8px] top-[7px]"
      width="16"
      height="14"
      viewBox="0 0 89 77"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {starPaths.map((path) => (
        <motion.path
          initial={{
            scale: 0,
            rotate: 30,
            opacity: 0
          }}
          animate={{
            scale: 1,
            rotate: -30,
            opacity: 1
          }}
          transition={{ delay: 0.15, duration: 0.5 }}
          key={path}
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          d={path}
          fill="#C6D0D1"
        />
      ))}
    </svg>
  );

  // prettier-ignore
  const clouds = (
    <motion.svg 
      animate={{
        opacity: isDark ? 0 : 1,
        x: isDark ? -5 : 0,
      }}
      transition={{
        delay: isDark ? 0 : 0.15
      }}
      className="absolute right-[10px] top-[10px]" width="15" height="8" viewBox="0 0 104 54" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.0258 11.2704C18.0258 5.34458 22.8296 0.540771 28.7554 0.540771H93.1331C99.0589 0.540771 103.863 5.34458 103.863 11.2704C103.863 17.1962 99.0589 22 93.1331 22H66.2146C63.3038 22 60.9442 24.3596 60.9442 27.2704V27.2704C60.9442 30.1811 63.3038 32.5408 66.2146 32.5408H75.1073C81.0331 32.5408 85.8369 37.3446 85.8369 43.2704C85.8369 49.1962 81.0331 54 75.1073 54H10.7296C4.80381 54 0 49.1962 0 43.2704C0 37.3446 4.80381 32.5408 10.7296 32.5408H44.7296C47.6404 32.5408 50 30.1811 50 27.2704V27.2704C50 24.3596 47.6404 22 44.7296 22H28.7554C22.8296 22 18.0258 17.1962 18.0258 11.2704Z" fill="white" />
    </motion.svg>
  )

  return (
    <ClientOnly>
      <motion.div
        animate={{
          backgroundColor: isDark ? '#475569' : '#7dd3fc'
        }}
        role="button"
        className="relative h-[28px] w-[56px] cursor-pointer rounded-full p-[5px]"
        onClick={handleToggleTheme}
      >
        {starts}
        {clouds}
        <motion.div
          animate={{
            x: isDark ? 28 : 0,
            rotate: isDark ? 0 : 180,
            backgroundColor: isDark ? '#c6d0d1' : '#fde047'
          }}
          className="relative h-[18px] w-[18px] rounded-full"
        >
          <motion.div
            animate={{
              opacity: isDark ? 1 : 0
            }}
            className="relative h-full w-full"
          >
            <div className="absolute left-[4px] top-[6px] h-[4px] w-[4px] rounded-full bg-slate-400/50 shadow-inner" />
            <div className="absolute left-[11px] top-[8px] h-[1px] w-[1px] rounded-full bg-slate-400/50 shadow-inner" />
            <div className="absolute left-[9px] top-[11px] h-[2px] w-[2px] rounded-full bg-slate-400/50 shadow-inner" />
          </motion.div>
        </motion.div>
      </motion.div>
    </ClientOnly>
  );
}
