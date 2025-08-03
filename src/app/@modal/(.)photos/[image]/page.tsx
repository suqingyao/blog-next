'use client';

import { useRef, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';

import { useEventListener } from '@/hooks/use-event-listener';
import { useModalRectAtom } from '@/hooks/use-modal-rect-atom';
import { useOutsideClick } from '@/hooks/use-outside-click';
import { useBodyScrollLock } from '@/hooks/use-body-scroll-lock';
import { useInitialScrollPosition } from '@/hooks/use-scroll-position';

export default function PhotosModalPage() {
  const { image } = useParams();
  const searchParams = useSearchParams();
  const url = decodeURIComponent(searchParams.get('url') || '');
  const router = useRouter();
  const { modalRectAtom, setModalRectAtom } = useModalRectAtom();
  const [show, setShow] = useState(true);
  const [scrollLocked, setScrollLocked] = useState(true);
  const imageRef = useRef<HTMLImageElement>(null);
  const initialScrollY = useInitialScrollPosition();

  // 使用自定义Hook管理滚动锁定
  useBodyScrollLock(scrollLocked);

  useOutsideClick(imageRef, (e) => handleClose(e as any));

  useEventListener(
    'keydown',
    (e) => {
      if ((e as KeyboardEvent).key === 'Escape') {
        handleClose();
      }
    },
    window
  );

  function handleClose(e?: React.MouseEvent<HTMLDivElement>) {
    e?.stopPropagation();
    setShow(false);
  }

  function handleExitComplete() {
    // 在动画完成时立即解除滚动锁定
    setScrollLocked(false);
    setModalRectAtom(null);
    // 延迟路由变化，确保滚动状态完全恢复
    setTimeout(() => {
      router.back();
    }, 100);
  }

  // 动画 variants
  let containerVariants = {};
  if (modalRectAtom) {
    const { left, top, width, height } = modalRectAtom;
    const centerX = left - window.scrollX + width / 2;
    const centerY = top - window.scrollY + height / 2;
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
        transition: { type: 'spring' as const, stiffness: 200, damping: 15 }
      },
      exit: {
        width,
        height,
        left: centerX,
        top: centerY - initialScrollY,
        x: '-50%',
        y: '-50%',
        position: 'fixed',
        zIndex: 100,
        opacity: 1,
        transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
      }
    };
  } else {
    // fallback: 居中显示
    containerVariants = {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration: 0.2 } },
      exit: {
        opacity: 0,
        transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
      }
    };
  }

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {show && (
        <>
          {/* Backdrop 参与 AnimatePresence 动画 */}
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
            className="flex items-center justify-center"
          >
            <img
              ref={imageRef}
              src={url}
              alt={image as string}
              className="h-full rounded-xs object-cover"
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
