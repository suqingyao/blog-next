'use client';

import type { Platform } from '@/components/links';
import { m } from 'motion/react';
import Image from 'next/image';
import { SocialLink } from '@/components/links';

const SOCIAL_LINKS: { href: string; platform: Platform }[] = [
  { href: 'https://github.com/suqingyao', platform: 'github' },
  { href: 'https://twitter.com/suqingyao333', platform: 'twitter' },
  { href: 'mailto:suqingyao333@gmail.com', platform: 'mail' },
  { href: 'https://space.bilibili.com/27022081', platform: 'bilibili' },
  { href: '/api/feed', platform: 'rss' },
];

export function Hero() {
  return (
    <m.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col-reverse gap-8 py-12 md:flex-row md:items-center md:justify-between md:gap-12"
    >
      <div className="flex-1 space-y-6">
        <m.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-5 text-4xl font-bold leading-tight md:text-4xl lg:text-6xl text-black dark:text-white"
        >
          Hi, SuQingyao
        </m.h1>
        <m.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="text-base font-semibold text-neutral-600 dark:text-neutral-400 mb-6"
        >
          FrontEnd Developer
        </m.p>

        <m.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="max-w-md leading-relaxed text-neutral-600 dark:text-neutral-400 mb-2 flex flex-col"
        >
          <span>Currently live in Chongqing, China.</span>
          <span>Loves music, programming and exploring new technologies.</span>
          <span>Introverted but friendly.</span>
        </m.p>

        <m.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex gap-5"
        >
          {SOCIAL_LINKS.map(link => (
            <SocialLink key={link.href} {...link} />
          ))}
        </m.section>
      </div>

      <m.section
        initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 20 }}
        className="relative mx-auto h-40 w-40 shrink-0 md:mx-0 md:h-52 md:w-52"
      >
        <div className="absolute inset-0 rotate-6 rounded-3xl bg-zinc-100 dark:bg-zinc-800" />
        <div className="absolute inset-0 -rotate-6 rounded-3xl bg-zinc-200 dark:bg-zinc-700" />
        <div className="relative h-full w-full overflow-hidden rounded-3xl bg-white shadow-2xl ring-4 ring-white dark:bg-zinc-900 dark:ring-zinc-900">
          <Image
            src="/avatar.png"
            alt="SuQingyao"
            fill
            className="object-cover transition-transform duration-500 hover:scale-110"
            priority
            sizes="(max-width: 768px) 160px, 208px"
          />
        </div>
      </m.section>
    </m.section>
  );
}
