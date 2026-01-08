import * as ScrollAreaBase from '@radix-ui/react-scroll-area';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { ScrollElementContext } from './ctx';

import './index.css';

function Corner({
  ref: forwardedRef,
  className,
  ...rest
}: React.ComponentPropsWithoutRef<typeof ScrollAreaBase.Corner> & {
  ref?: React.Ref<React.ElementRef<typeof ScrollAreaBase.Corner> | null>;
}) {
  return <ScrollAreaBase.Corner {...rest} ref={forwardedRef} className={cn('bg-accent', className)} />;
}

Corner.displayName = 'ScrollArea.Corner';

function Thumb({
  ref: forwardedRef,
  className,
  ...rest
}: React.ComponentPropsWithoutRef<typeof ScrollAreaBase.Thumb> & {
  ref?: React.Ref<React.ElementRef<typeof ScrollAreaBase.Thumb> | null>;
}) {
  return (
    <ScrollAreaBase.Thumb
      {...rest}
      onClick={(e) => {
        e.stopPropagation();
        rest.onClick?.(e);
      }}
      ref={forwardedRef}
      className={cn(
        'relative w-full flex-1 backdrop-blur-3xl rounded-xl transition-colors duration-150',
        'bg-zinc-500/50 hover:bg-zinc-500/70',
        'active:bg-zinc-500/70',
        'before:absolute before:-left-1/2 before:-top-1/2 before:h-full before:min-h-[44]',
        'before:w-full before:min-w-[44] before:-translate-x-full before:-translate-y-full before:content-[""]',

        className,
      )}
    />
  );
}
Thumb.displayName = 'ScrollArea.Thumb';

function Scrollbar({
  ref: forwardedRef,
  className,
  children,
  ...rest
}: React.ComponentPropsWithoutRef<typeof ScrollAreaBase.Scrollbar> & {
  ref?: React.Ref<React.ElementRef<typeof ScrollAreaBase.Scrollbar> | null>;
}) {
  const { orientation = 'vertical' } = rest;
  return (
    <ScrollAreaBase.Scrollbar
      {...rest}
      ref={forwardedRef}
      className={cn(
        'flex w-2.5 touch-none select-none p-0.5',
        orientation === 'horizontal' ? `h-2.5 w-full flex-col` : `w-2.5 flex-row`,
        'animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in',
        className,
      )}
    >
      {children}
      <Thumb />
    </ScrollAreaBase.Scrollbar>
  );
}
Scrollbar.displayName = 'ScrollArea.Scrollbar';

function Viewport({
  ref: forwardedRef,
  className,
  mask = false,
  focusable = true,
  ...rest
}: React.ComponentPropsWithoutRef<typeof ScrollAreaBase.Viewport> & {
  mask?: boolean;
  focusable?: boolean;
} & {
  ref?: React.Ref<React.ElementRef<typeof ScrollAreaBase.Viewport> | null>;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useImperativeHandle(forwardedRef, () => ref.current as HTMLDivElement);
  return (
    <ScrollAreaBase.Viewport
      {...rest}
      ref={ref}
      tabIndex={focusable ? -1 : void 0}
      className={cn('block size-full', mask && 'mask-scroller', className)}
    />
  );
}
Viewport.displayName = 'ScrollArea.Viewport';

function Root({
  ref: forwardedRef,
  className,
  children,
  ...rest
}: React.ComponentPropsWithoutRef<typeof ScrollAreaBase.Root> & {
  ref?: React.Ref<React.ElementRef<typeof ScrollAreaBase.Root> | null>;
}) {
  return (
    <ScrollAreaBase.Root {...rest} scrollHideDelay={0} ref={forwardedRef} className={cn('overflow-hidden', className)}>
      {children}
      <Corner />
    </ScrollAreaBase.Root>
  );
}

Root.displayName = 'ScrollArea.Root';
export function ScrollArea({
  ref,
  flex,
  children,
  rootClassName,
  viewportClassName,
  scrollbarClassName,
  mask = false,
  onScroll,
  orientation = 'vertical',
  asChild = false,

  focusable = true,
}: React.PropsWithChildren & {
  rootClassName?: string;
  viewportClassName?: string;
  scrollbarClassName?: string;
  flex?: boolean;
  mask?: boolean;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
  orientation?: 'vertical' | 'horizontal';
  asChild?: boolean;
  focusable?: boolean;
} & { ref?: React.Ref<HTMLDivElement | null> }) {
  const [viewportRef, setViewportRef] = React.useState<HTMLDivElement | null>(null);
  React.useImperativeHandle(ref, () => viewportRef as HTMLDivElement);

  return (
    <ScrollElementContext value={viewportRef}>
      <Root className={rootClassName}>
        <Viewport
          onWheel={e => e.stopPropagation()}
          ref={setViewportRef}
          className={cn(flex ? '[&>div]:!flex [&>div]:!flex-col' : '', viewportClassName)}
          mask={mask}
          asChild={asChild}
          onScroll={onScroll}
          focusable={focusable}
        >
          {children}
        </Viewport>
        <Scrollbar orientation={orientation} className={scrollbarClassName} />
      </Root>
    </ScrollElementContext>
  );
}
