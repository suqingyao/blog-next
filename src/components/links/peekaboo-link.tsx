'use client';

import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';
import Link, { type LinkProps } from 'next/link';
import React from 'react';
import { encode } from 'qss';

import { HoverCard } from '../ui/hover-card';
import { RichLink } from './rich-link';

type PeekabooLinkProps = LinkProps &
  React.ComponentPropsWithoutRef<'a'> & {
    children: React.ReactNode;
  };
export function PeekabooLink({
  href,
  children,
  className,
  ...props
}: PeekabooLinkProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);

  // 生成 microlink.io URL，与 LinkPreview 组件保持一致
  const params = encode({
    url: href,
    screenshot: true,
    meta: false,
    embed: 'screenshot.url',
    colorScheme: 'dark',
    'viewport.isMobile': true,
    'viewport.deviceScaleFactor': 1,
    'viewport.width': 400 * 3,
    'viewport.height': 250 * 3
  });
  const microlinkSrc = `https://api.microlink.io/?${params}`;

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // if it's a relative link, use a fallback Link
  if (!href.startsWith('http')) {
    return (
      <Link
        href={href}
        className={cn(className)}
        {...props}
      >
        {children}
      </Link>
    );
  }

  if (!process.env.NEXT_PUBLIC_SITE_LINK_PREVIEW_ENABLED) {
    return (
      <RichLink
        href={href}
        className={cn(
          'font-semibold text-zinc-800 hover:underline dark:text-zinc-100',
          className
        )}
        target="_blank"
        {...props}
      >
        {children}
      </RichLink>
    );
  }

  function onOpenChange(open: boolean) {
    setIsOpen(open);
  }

  return (
    <HoverCard.Root
      openDelay={0}
      closeDelay={50}
      onOpenChange={onOpenChange}
    >
      <HoverCard.Trigger asChild>
        <RichLink
          href={href}
          className={cn(
            'font-semibold text-zinc-800 hover:underline dark:text-zinc-100',
            className
          )}
          target="_blank"
          {...props}
        >
          {children}
        </RichLink>
      </HoverCard.Trigger>
      <>
        {isMounted ? (
          <div className="hidden">
            <Image
              src={microlinkSrc}
              width={400}
              height={250}
              quality={50}
              layout="fixed"
              priority={true}
              alt="hidden image"
              unoptimized
            />
          </div>
        ) : null}
        <AnimatePresence mode="wait">
          {isOpen && (
            <HoverCard.Portal forceMount>
              <HoverCard.Content
                asChild
                collisionPadding={250}
              >
                <motion.div
                  className="pointer-events-none relative z-50 w-[400px] origin-top overflow-hidden !p-0"
                  initial={{
                    opacity: 0,
                    scale: 0.965,
                    y: 9,
                    height: 0
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    height: 250
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.98,
                    y: 8,
                    height: 0
                  }}
                  transition={{
                    duration: 0.2
                  }}
                >
                  <Link
                    href={href}
                    className="block rounded-xl border-2 border-transparent bg-white p-1 shadow hover:border-neutral-200 dark:hover:border-neutral-800"
                    style={{ fontSize: 0 }}
                  >
                    <Image
                      src={microlinkSrc}
                      width={400}
                      height={250}
                      quality={50}
                      layout="fixed"
                      priority={true}
                      className="rounded-lg"
                      alt="preview image"
                      unoptimized
                    />
                  </Link>
                </motion.div>
              </HoverCard.Content>
            </HoverCard.Portal>
          )}
        </AnimatePresence>
      </>
    </HoverCard.Root>
  );
}
