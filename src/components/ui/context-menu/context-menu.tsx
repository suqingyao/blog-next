import * as ContextMenuPrimitive from '@radix-ui/react-context-menu';
import * as React from 'react';
import { cn } from '@/lib/utils';

const ContextMenu = ContextMenuPrimitive.Root;
const ContextMenuTrigger = ContextMenuPrimitive.Trigger;
const ContextMenuGroup = ContextMenuPrimitive.Group;
const ContextMenuSub = ContextMenuPrimitive.Sub;
const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;
const RootPortal = ContextMenuPrimitive.Portal;

function ContextMenuSubTrigger({
  ref,
  className,
  inset,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> & {
  inset?: boolean;
} & {
  ref?: React.Ref<React.ElementRef<typeof ContextMenuPrimitive.SubTrigger> | null>;
}) {
  return (
    <ContextMenuPrimitive.SubTrigger
      ref={ref}
      className={cn(
        'focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex select-none items-center rounded-[5px] px-2.5 py-1.5 outline-none',
        inset && 'pl-8',
        'flex items-center justify-center gap-2',
        className,
        props.disabled && 'cursor-not-allowed opacity-30',
      )}
      {...props}
    >
      {children}
      <i className="i-mingcute-right-line -mr-1 ml-auto size-3.5" />
    </ContextMenuPrimitive.SubTrigger>
  );
}
ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName;

function ContextMenuSubContent({
  ref,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent> & {
  ref?: React.Ref<React.ElementRef<typeof ContextMenuPrimitive.SubContent> | null>;
}) {
  return (
    <RootPortal>
      <ContextMenuPrimitive.SubContent
        ref={ref}
        className={cn(
          'backdrop-blur-2xl text-text text-body',
          'min-w-32 overflow-hidden',
          'rounded-xl p-1 relative border border-accent/20',
          'z-10061',
          className,
        )}
        style={{
          backgroundImage:
          'linear-gradient(to bottom right, color-mix(in srgb, var(--color-background) 98%, transparent), color-mix(in srgb, var(--color-background) 95%, transparent))',
          boxShadow:
          '0 8px 32px color-mix(in srgb, var(--color-accent) 8%, transparent), 0 4px 16px color-mix(in srgb, var(--color-accent) 6%, transparent), 0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
        {...props}
      />
    </RootPortal>
  );
}
ContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName;

function ContextMenuContent({
  ref,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content> & {
  ref?: React.Ref<React.ElementRef<typeof ContextMenuPrimitive.Content> | null>;
}) {
  return (
    <RootPortal>
      <ContextMenuPrimitive.Content
        ref={ref}
        className={cn(
          'backdrop-blur-2xl text-text z-10060 min-w-32 overflow-hidden rounded-xl p-1 relative border border-accent/20',
          'motion-scale-in-75 motion-duration-150 text-body lg:animate-none',
          className,
        )}
        style={{
          backgroundImage:
          'linear-gradient(to bottom right, color-mix(in srgb, var(--color-background) 98%, transparent), color-mix(in srgb, var(--color-background) 95%, transparent))',
          boxShadow:
          '0 8px 32px color-mix(in srgb, var(--color-accent) 8%, transparent), 0 4px 16px color-mix(in srgb, var(--color-accent) 6%, transparent), 0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
        {...props}
      />
    </RootPortal>
  );
}
ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName;

function ContextMenuItem({
  ref,
  className,
  inset,
  ...props
}: React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & {
  inset?: boolean;
} & {
  ref?: React.Ref<React.ElementRef<typeof ContextMenuPrimitive.Item> | null>;
}) {
  return (
    <ContextMenuPrimitive.Item
      ref={ref}
      className={cn(
        'cursor-menu text-sm relative flex select-none items-center rounded-lg px-2.5 py-1 outline-none data-disabled:pointer-events-none data-disabled:opacity-50',
        'focus-within:outline-transparent transition-all duration-200',
        'data-highlighted:text-accent',
        'h-[28px]',
        inset && 'pl-8',
        className,
      )}
      style={{
      // @ts-ignore - CSS variable for data-highlighted state
        '--highlight-bg':
        'linear-gradient(to right, color-mix(in srgb, var(--color-accent) 8%, transparent), color-mix(in srgb, var(--color-accent) 5%, transparent))',
      }}
      {...props}
    />
  );
}
ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName;

function ContextMenuCheckboxItem({
  ref,
  className,
  children,
  checked,
  ...props
}: React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem> & {
  ref?: React.Ref<React.ElementRef<typeof ContextMenuPrimitive.CheckboxItem> | null>;
}) {
  return (
    <ContextMenuPrimitive.CheckboxItem
      ref={ref}
      className={cn(
        'cursor-checkbox text-sm relative flex select-none items-center rounded-lg px-8 py-1.5 outline-none data-disabled:pointer-events-none data-disabled:opacity-50',
        'focus-within:outline-transparent transition-all duration-200',
        'data-highlighted:text-accent',
        'h-[28px]',
        className,
      )}
      checked={checked}
      style={{
      // @ts-ignore - CSS variable for data-highlighted state
        '--highlight-bg':
        'linear-gradient(to right, color-mix(in srgb, var(--color-accent) 8%, transparent), color-mix(in srgb, var(--color-accent) 5%, transparent))',
      }}
      {...props}
    >
      <span className="absolute left-2 flex items-center justify-center">
        <ContextMenuPrimitive.ItemIndicator asChild>
          <i className="i-mgc-check-filled size-3" />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  );
}
ContextMenuCheckboxItem.displayName = ContextMenuPrimitive.CheckboxItem.displayName;

function ContextMenuLabel({
  ref,
  className,
  inset,
  ...props
}: React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & {
  inset?: boolean;
} & {
  ref?: React.Ref<React.ElementRef<typeof ContextMenuPrimitive.Label> | null>;
}) {
  return (
    <ContextMenuPrimitive.Label
      ref={ref}
      className={cn('text-text px-2 py-1.5 font-semibold', inset && 'pl-8', className)}
      {...props}
    />
  );
}
ContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName;

function ContextMenuSeparator({
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator> & {
  ref?: React.Ref<React.ElementRef<typeof ContextMenuPrimitive.Separator> | null>;
}) {
  return (
    <ContextMenuPrimitive.Separator
      className="mx-2 my-1 h-px"
      style={{
        background:
        'linear-gradient(to right, transparent, color-mix(in srgb, var(--color-accent) 20%, transparent), transparent)',
      }}
      ref={ref}
      {...props}
    />
  );
}
ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName;

export {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  RootPortal as ContextMenuPortal,
  ContextMenuRadioGroup,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
};
