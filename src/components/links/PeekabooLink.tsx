'use client';

import type { LinkProps } from 'next/link';
import { AnimatePresence, m } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { encode } from 'qss';
import React from 'react';

import { useIsMounted } from '@/hooks/use-is-mounted';
import { cn } from '@/lib/utils';
import { HoverCard, HoverCardContent, HoverCardPortal, HoverCardTrigger } from '../ui/hover-card';
import { RichLink } from './RichLink';

type PeekabooLinkProps = LinkProps
  & React.ComponentPropsWithoutRef<'a'> & {
    children: React.ReactNode;
  };
export function PeekabooLink({
  href,
  children,
  className,
  ...props
}: PeekabooLinkProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const isMounted = useIsMounted();

  // 生成 microlink.io URL，与 LinkPreview 组件保持一致
  const params = encode({
    'url': href,
    'screenshot': true,
    'meta': false,
    'embed': 'screenshot.url',
    'colorScheme': 'dark',
    'viewport.isMobile': true,
    'viewport.deviceScaleFactor': 1,
    'viewport.width': 400 * 3,
    'viewport.height': 250 * 3,
  });
  const microlinkSrc = `https://api.microlink.io/?${params}`;

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

  // Render simple RichLink if link preview is disabled OR if not yet mounted (to avoid hydration mismatch)
  if (!isMounted) {
    return (
      <RichLink
        href={href}
        className={cn(
          'font-semibold text-zinc-800 hover:underline dark:text-zinc-100',
          className,
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

  // Only render HoverCard on client side after mount
  return (
    <HoverCard
      openDelay={0}
      closeDelay={50}
      onOpenChange={onOpenChange}
    >
      <HoverCardTrigger asChild>
        <RichLink
          href={href}
          className={cn(
            'font-semibold text-zinc-800 hover:underline dark:text-zinc-100',
            className,
          )}
          target="_blank"
          {...props}
        >
          {children}
        </RichLink>
      </HoverCardTrigger>
      <>
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
        <AnimatePresence mode="wait">
          {isOpen && (
            <HoverCardPortal forceMount>
              <HoverCardContent
                asChild
                collisionPadding={250}
                className="z-100 w-110 flex items-center justify-center"
              >
                <m.div
                  className="pointer-events-none relative z-50 w-[400px] origin-top overflow-hidden !p-0"
                  initial={{
                    opacity: 0,
                    scale: 0.965,
                    y: 9,
                    height: 0,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    height: 250,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.98,
                    y: 8,
                    height: 0,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                >
                  <Link
                    href={href}
                    className="block rounded-2xl"
                    style={{ fontSize: 0 }}
                  >
                    <Image
                      src={microlinkSrc}
                      width={400}
                      height={250}
                      quality={50}
                      layout="fixed"
                      priority={true}
                      className="rounded-2xl"
                      alt="preview image"
                      unoptimized
                    />
                  </Link>
                </m.div>
              </HoverCardContent>
            </HoverCardPortal>
          )}
        </AnimatePresence>
      </>
    </HoverCard>
  );
}
