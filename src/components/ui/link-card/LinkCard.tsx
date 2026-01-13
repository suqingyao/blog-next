'use client';

import { m, useMotionTemplate } from 'motion/react';
import Link from 'next/link';

import { DarkModeOnly } from '@/components/common/DarkModeOnly';

import { useSpotlight } from '@/hooks/use-spotlight';

interface LinkCardProps {
  title: string;
  description?: string;
  href: string;
  image?: string;
}

export function LinkCard({
  title,
  description,
  href,
  image,
}: LinkCardProps) {
  const [{ x: spotX, y: spotY, r: spotR }, onMouseMove] = useSpotlight();

  // motion 动态 radial-gradient，圆心随鼠标 X/Y
  const background = useMotionTemplate`radial-gradient(${spotR}px circle at ${spotX}px ${spotY}px, currentColor, transparent 65%)`;

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative mx-auto my-12 block min-h-[83px] w-[460px] max-w-full overflow-hidden rounded-xl bg-zinc-400/20"
      onMouseMove={onMouseMove}
    >
      {/* Border shimmer layer */}
      <DarkModeOnly>
        <m.div
          className="pointer-events-none absolute inset-0 text-white/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background }}
        />
      </DarkModeOnly>
      {/* Spotlight layer */}
      <m.div
        className="pointer-events-none absolute inset-0 z-[1] text-black/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:text-white/10"
        style={{ background }}
        aria-hidden
      />
      {/* Content layer */}
      <div className="absolute inset-px flex items-center rounded-[11px] bg-zinc-50 p-2 dark:bg-zinc-900">
        <div className="relative z-[1] w-0 flex-1 px-3">
          <div className="truncate text-lg leading-tight font-semibold">
            {title}
          </div>
          <div
            className="mt-1 truncate text-sm leading-tight text-zinc-500"
            title={description}
          >
            {description}
          </div>
        </div>
        {image && (
          <img
            className="h-[65px] rounded-lg"
            src={image}
            alt="og"
          />
        )}
      </div>
    </Link>
  );
}
