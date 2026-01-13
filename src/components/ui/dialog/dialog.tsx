import * as DialogPrimitive from '@radix-ui/react-dialog';
import { AnimatePresence, m } from 'motion/react';
import * as React from 'react';
import { Spring } from '@/lib/spring';
import { cn } from '@/lib/utils';

import { useRootPortal } from '../portal/provider';

const DialogContext = React.createContext<{ open: boolean }>({ open: false });

function Dialog({ children, ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  const [open, setOpen] = React.useState(props.open || false);

  React.useEffect(() => {
    if (props.open !== undefined) {
      setOpen(props.open);
    }
  }, [props.open]);

  return (
    <DialogContext value={React.useMemo(() => ({ open }), [open])}>
      <DialogPrimitive.Root
        {...props}
        open={open}
        onOpenChange={(openState) => {
          setOpen(openState);
          props.onOpenChange?.(openState);
        }}
      >
        {children}
      </DialogPrimitive.Root>
    </DialogContext>
  );
}

const DialogTrigger = DialogPrimitive.Trigger;
const DialogClose = DialogPrimitive.Close;

function DialogPortal({ children, ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  const { open } = React.use(DialogContext);
  const to = useRootPortal();

  return (
    <DialogPrimitive.Portal container={to} forceMount {...props}>
      <AnimatePresence mode="wait">{open && children}</AnimatePresence>
    </DialogPrimitive.Portal>
  );
}

function DialogOverlay({
  ref,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> & {
  ref?: React.RefObject<React.ComponentRef<typeof DialogPrimitive.Overlay> | null>;
}) {
  return (
    <DialogPrimitive.Overlay ref={ref} className={cn('fixed inset-0 z-100000000', className)} asChild {...props}>
      <m.div
        className="bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={Spring.presets.smooth}
      />
    </DialogPrimitive.Overlay>
  );
}
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

function DialogContent({
  ref,
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
  ref?: React.RefObject<React.ComponentRef<typeof DialogPrimitive.Content> | null>;
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn('fixed left-[50%] top-[50%] z-100000000 w-full max-w-lg', className)}
        asChild
        {...props}
      >
        <m.div
          className="border-accent/20 gap-4 overflow-hidden rounded-2xl border p-6 backdrop-blur-2xl"
          style={{
            backgroundImage:
            'linear-gradient(to bottom right, color-mix(in srgb, var(--color-background) 98%, transparent), color-mix(in srgb, var(--color-background) 95%, transparent))',
            boxShadow:
            '0 8px 32px color-mix(in srgb, var(--color-accent) 8%, transparent), 0 4px 16px color-mix(in srgb, var(--color-accent) 6%, transparent), 0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
          initial={{
            opacity: 0,
            scale: 0.95,
            y: 8,
            x: '-50%',
            translateY: '-50%',
          }}
          animate={{ opacity: 1, scale: 1, y: 0, x: '-50%', translateY: '-50%' }}
          exit={{ opacity: 0, scale: 0.95, y: 8, x: '-50%', translateY: '-50%' }}
          transition={Spring.presets.smooth}
        >
          {/* Inner glow layer */}
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{
              background:
              'linear-gradient(to bottom right, color-mix(in srgb, var(--color-accent) 5%, transparent), transparent, color-mix(in srgb, var(--color-accent) 5%, transparent))',
            }}
          />

          {/* Content */}
          <div className="relative flex h-0 flex-1 flex-col">{children}</div>
        </m.div>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}
DialogContent.displayName = DialogPrimitive.Content.displayName;

function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)} {...props} />;
}
DialogHeader.displayName = 'DialogHeader';

function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)} {...props} />;
}
DialogFooter.displayName = 'DialogFooter';

function DialogTitle({
  ref,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title> & {
  ref?: React.RefObject<React.ComponentRef<typeof DialogPrimitive.Title> | null>;
}) {
  return (
    <DialogPrimitive.Title
      ref={ref}
      className={cn('text-lg font-semibold leading-none tracking-tight text-white', className)}
      {...props}
    />
  );
}
DialogTitle.displayName = DialogPrimitive.Title.displayName;

function DialogDescription({
  ref,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description> & {
  ref?: React.RefObject<React.ComponentRef<typeof DialogPrimitive.Description> | null>;
}) {
  return <DialogPrimitive.Description ref={ref} className={cn('text-sm text-white/70', className)} {...props} />;
}
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
