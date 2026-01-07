'use client';

import type { LinkProps } from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import React from 'react';
import { Tooltip } from '@/components/ui/tooltip';

export type Platform = 'github' | 'twitter' | 'youtube' | 'telegram' | 'bilibili' | 'mail' | 'rss';

interface PlatformInfo {
  icon: string;
  platform: Platform;
  label: string;
}

const iconMapper: Record<Platform, PlatformInfo> = {
  github: {
    icon: 'i-mingcute-github-line',
    platform: 'github',
    label: 'GitHub',
  },
  twitter: {
    icon: 'i-ri-twitter-x-line',
    platform: 'twitter',
    label: 'Twitter',
  },
  youtube: {
    icon: 'i-mingcute-youtube-line',
    platform: 'youtube',
    label: 'YouTube',
  },
  telegram: {
    icon: 'i-mingcute-telegram-line',
    platform: 'telegram',
    label: 'Telegram',
  },
  bilibili: {
    icon: 'i-ri-bilibili-line',
    platform: 'bilibili',
    label: '哔哩哔哩',
  },
  mail: {
    icon: 'i-mingcute-mail-line',
    platform: 'mail',
    label: '邮箱',
  },
  rss: {
    icon: 'i-mingcute-rss-line',
    platform: 'rss',
    label: 'RSS 订阅',
  },
};

export function SocialLink({
  platform,
  href,
  ...props
}: { platform: Platform } & LinkProps & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const [open, setOpen] = React.useState(false);
  const info = iconMapper[platform];

  if (!info) {
    return null;
  }

  return (
    <Tooltip.Provider disableHoverableContent>
      <Tooltip.Root
        open={open}
        onOpenChange={setOpen}
        delayDuration={200}
      >
        <Tooltip.Trigger asChild>
          <Link
            className="group -m-1 p-1"
            href={href}
            target="_blank"
            prefetch={false}
            aria-label={info.label}
            {...props}
          >
            <span className={`${info.icon} block h-5 w-5 text-zinc-400 transition-colors group-hover:text-zinc-700 dark:text-zinc-400 dark:group-hover:text-zinc-200`} />
          </Link>
        </Tooltip.Trigger>
        <AnimatePresence>
          {open && (
            <Tooltip.Portal forceMount>
              <Tooltip.Content asChild>
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  {info.label}
                </motion.div>
              </Tooltip.Content>
            </Tooltip.Portal>
          )}
        </AnimatePresence>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
