'use client';

import type { PhotoFile } from '@/lib/photos';
import { AnimatePresence, motion } from 'motion/react';
import { useRouter } from 'next/navigation';

import { useMemo, useRef, useState } from 'react';
import { useBodyScrollLock } from '@/hooks/use-body-scroll-lock';
import { useEventListener } from '@/hooks/use-event-listener';
import { useOutsideClick } from '@/hooks/use-outside-click';
import { useModalRectAtom } from '@/store/hooks/use-modal-rect-atom';

export function PhotoModal({ photo }: { photo: PhotoFile }) {
  const router = useRouter();
  const { modalRectAtom, setModalRectAtom } = useModalRectAtom();

  const [show, setShow] = useState(true);
  const [scrollLocked, setScrollLocked] = useState(true);
  const imageRef = useRef<HTMLImageElement>(null);

  useBodyScrollLock(scrollLocked);

  useOutsideClick(imageRef, e => handleClose(e as any));

  useEventListener(
    'keydown',
    (e) => {
      if ((e as KeyboardEvent).key === 'Escape') {
        handleClose();
      }
    },
    window,
  );

  const containerVariants = useMemo(() => {
    if (!modalRectAtom) {
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: {
          opacity: 0,
        },
      };
    }
    const { left, top, width, height } = modalRectAtom;
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    return {
      initial: {
        width,
        height,
        left: centerX,
        top: centerY,
        x: '-50%',
        y: '-50%',
        position: 'fixed',
        zIndex: 110,
        opacity: 1,
      },
      animate: {
        width: '90vw',
        height: '90vh',
        left: '50vw',
        top: '50vh',
        x: '-50%',
        y: '-50%',
        position: 'fixed',
        zIndex: 110,
        opacity: 1,
      },
      exit: {
        width,
        height,
        left: centerX,
        top: centerY,
        x: '-50%',
        y: '-50%',
        position: 'fixed',
        zIndex: 110,
        opacity: 1,
      },
    };
  }, [modalRectAtom]);

  function handleClose(
    e?: React.MouseEvent<HTMLDivElement | HTMLButtonElement>,
  ) {
    e?.stopPropagation();
    setShow(false);
  }

  function handleExitComplete() {
    setScrollLocked(false);
    setModalRectAtom(null);
    // 路由变化不需要延迟，滚动已经在关闭时恢复
    router.back();
  }

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {show && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/10 backdrop-blur-sm"
            onClick={handleClose}
          />
          <motion.div
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 z-110 flex items-center justify-center p-4"
          >
            <img
              ref={imageRef}
              src={photo.absUrl}
              alt={photo.name}
              className="h-full object-cover"
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
