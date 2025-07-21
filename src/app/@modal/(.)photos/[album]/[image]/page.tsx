'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';

import { useEventListener } from '@/hooks/use-event-listener';
import { useModalRectAtom } from '@/hooks/use-modal-rect-atom';
import { useOutsideClick } from '@/hooks/use-outside-click';

export default function PhotosModalPage() {
  const { album, image } = useParams();
  const router = useRouter();
  const { modalRectAtom, setModalRectAtom } = useModalRectAtom();
  const [show, setShow] = useState(true);
  const imageRef = useRef<HTMLImageElement>(null);

  useOutsideClick(imageRef, handleClose);

  useEventListener(
    'keydown',
    (e) => {
      if ((e as KeyboardEvent).key === 'Escape') {
        handleClose();
      }
    },
    window
  );

  useEffect(() => {
    // 禁止滚动
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  function handleClose() {
    setShow(false);
  }

  function handleExitComplete() {
    setModalRectAtom(null);
    router.back();
  }

  // 动画 variants
  let containerVariants;
  if (modalRectAtom) {
    const { left, top, width, height } = modalRectAtom;
    const centerX = left + width / 2;
    const centerY =
      top + height / 2 - (typeof window !== 'undefined' ? window.scrollY : 0);
    containerVariants = {
      initial: {
        width,
        height,
        left: centerX,
        top: centerY,
        x: '-50%',
        y: '-50%',
        position: 'fixed',
        zIndex: 100,
        opacity: 1
      },
      animate: {
        width: '80vw',
        height: '80vh',
        left: '50vw',
        top: '50vh',
        x: '-50%',
        y: '-50%',
        position: 'fixed',
        zIndex: 100,
        opacity: 1,
        transition: { type: 'spring' as const, stiffness: 200, damping: 30 }
      },
      exit: {
        width,
        height,
        left: centerX,
        top: centerY,
        x: '-50%',
        y: '-50%',
        position: 'fixed',
        zIndex: 100,
        opacity: 1,
        transition: { type: 'spring' as const, stiffness: 200, damping: 30 }
      }
    };
  } else {
    // fallback: 居中显示
    containerVariants = {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration: 0.2 } },
      exit: { opacity: 0, transition: { duration: 0.2 } }
    };
  }

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {show && (
        <>
          <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm"></div>
          <motion.div
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex items-center justify-center"
          >
            <img
              ref={imageRef}
              src={`/photos/${album}/${image}`}
              alt={image as string}
              className="h-full rounded-xl object-contain"
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
