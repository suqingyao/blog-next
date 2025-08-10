'use client';

import * as HoverCardPrimitive from '@radix-ui/react-hover-card';
import React from 'react';
import { cn } from '@/lib/utils';

const { Root, Trigger, Portal } = HoverCardPrimitive;

function Content({ ref, className, align = 'center', sideOffset = 4, ...props }: React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content> & { ref?: React.RefObject<React.ComponentRef<typeof HoverCardPrimitive.Content> | null> }) {
  return (
    <HoverCardPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        'rounded-xl border border-zinc-400/20 bg-white/80 p-4 text-zinc-800 shadow-lg backdrop-blur-lg outline-none dark:border-zinc-500/30 dark:bg-zinc-800/80 dark:text-zinc-200',
        className,
      )}
      {...props}
    />
  );
}
Content.displayName = HoverCardPrimitive.Content.displayName;

export const HoverCard = { Root, Trigger, Portal, Content } as const;
