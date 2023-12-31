'use client';

import Link from 'next/link';
import { motion, useMotionTemplate } from 'framer-motion';

import useSpotlight from '@/hooks/useSpotlight';

import LazyImage from './LazyImage';

interface LinkCardProps {
  title: string;
  description?: string;
  href: string;
  image?: string;
}

const LinkCard = ({ title, description, href, image }: LinkCardProps) => {
  const [{ x: spotX, y: spotY, r: spotR }, onMouseMove] = useSpotlight();

  const background = useMotionTemplate`radial-gradient(${spotR}px circle at ${spotX}px ${spotX}px, currentColor, transparent 65%)`;
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative mx-auto my-12 block min-h-[83px] w-[460px] max-w-full overflow-hidden rounded-xl bg-zinc-400/20"
      onMouseMove={onMouseMove}
    >
      {/* Border layer */}
      <motion.div
        className="pointer-events-none absolute inset-0 text-white/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(${spotR}px circle at ${spotX}px ${spotY}px, currentColor, transparent)`
        }}
      ></motion.div>

      {/* Spotlight layer */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-[1] text-black/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:text-white/10"
        style={{
          background
        }}
        aria-hidden
      ></motion.div>

      {/* Content layer */}
      <div className="absolute inset-px flex items-center rounded-[11px] bg-zinc-50 p-2 dark:bg-zinc-900">
        <div className="relative z-[1] w-0 flex-1 px-3">
          <span className="block truncate text-lg leading-tight">{title}</span>
          <span
            className="mt-1 block truncate text-sm leading-tight	text-zinc-500"
            title={description}
          >
            {description}
          </span>
        </div>
        {image && (
          <LazyImage
            className="block h-[64px] w-[96px]"
            src={image}
            alt="og"
          />
        )}
      </div>
    </Link>
  );
};

export default LinkCard;
