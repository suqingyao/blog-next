'use client';

import * as HoverCardPrimitive from '@radix-ui/react-hover-card';
import { cn } from '@/lib/utils';
import React from 'react';

const { Root, Trigger, Portal } = HoverCardPrimitive;

const Content = React.forwardRef<
  React.ComponentRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = 'center', sideOffset = 4, ...props }, ref) => (
  <HoverCardPrimitive.Content
    ref={ref}
    align={align}
    sideOffset={sideOffset}
    className={cn(
      'rounded-xl border border-zinc-400/20 bg-white/80 p-4 text-zinc-800 shadow-lg backdrop-blur-lg outline-none dark:border-zinc-500/30 dark:bg-zinc-800/80 dark:text-zinc-200',
      className
    )}
    {...props}
  />
));
Content.displayName = HoverCardPrimitive.Content.displayName;

export const HoverCard = { Root, Trigger, Portal, Content } as const;
