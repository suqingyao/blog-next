import type { ModalItem } from './ModalManager';
import type { ModalComponent } from './types';
import { useAtomValue } from 'jotai';
import { AnimatePresence } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';

import { useEventCallback } from 'usehooks-ts';
import { Spring } from '@/lib/spring';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent } from './Dialog';
import { Modal, modalItemsAtom } from './ModalManager';
import { modalStore } from './store';

export function ModalContainer() {
  const items = useAtomValue(modalItemsAtom, { store: modalStore });

  return (
    <div id="global-modal-container">
      <AnimatePresence initial={false}>
        {items.map(item => (
          <ModalWrapper key={item.id} item={item} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ModalWrapper({ item }: { item: ModalItem }) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    Modal.__registerCloser(item.id, () => setOpen(false));
    return () => {
      Modal.__unregisterCloser(item.id);
    };
  }, [item.id]);

  const dismiss = useMemo(
    () => () => {
      setOpen(false);
    },
    [],
  );

  const handleOpenChange = (o: boolean) => {
    setOpen(o);
  };

  // After exit animation, remove from store
  const handleAnimationComplete = useEventCallback(() => {
    if (!open) {
      const items = modalStore.get(modalItemsAtom);
      modalStore.set(
        modalItemsAtom,
        items.filter(m => m.id !== item.id),
      );
    }
  });

  const Component = item.component as ModalComponent<any>;

  const { contentProps, contentClassName } = Component;

  const mergedContentConfig = {
    ...contentProps,
    ...item.modalContent,
  };

  const { dismissOnOutsideClick = true, ...restContentConfig } = mergedContentConfig;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn('w-full max-w-md', contentClassName)}
        transition={Spring.presets.smooth}
        onAnimationComplete={handleAnimationComplete}
        dismissOnOutsideClick={item.dismissOnOutsideClick ?? dismissOnOutsideClick}
        {...restContentConfig}
      >
        <Component modalId={item.id} dismiss={dismiss} {...(item.props as any)} />
      </DialogContent>
    </Dialog>
  );
}
