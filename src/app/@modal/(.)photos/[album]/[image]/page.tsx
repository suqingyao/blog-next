'use client';

import { LazyImage } from '@/components/lazy-image';
import { useEventListener } from '@/hooks/use-event-listener';
import { useModalRectAtom } from '@/hooks/use-modal-rect-atom';
import { OSS_URL_PREFIX } from '@/lib/constants';
import { AnimatePresence, motion, scale } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Props {
  params: { album: string; image: string };
}

export default function PhotosModalPage({ params }: Props) {
  const router = useRouter();

  const { modalRectAtom } = useModalRectAtom();
  const [show, setShow] = useState(true);

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
    router.back();
  }

  const imageVariants = modalRectAtom
    ? {
        initial: {
          width: modalRectAtom.width,
          height: modalRectAtom.height,
          left: modalRectAtom.left,
          top: modalRectAtom.top,
          position: 'fixed',
          zIndex: 100,
          origin: 'center',
          scale: 1
        },
        animate: {
          width: modalRectAtom.width,
          height: modalRectAtom.height,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%) scale(2)',
          position: 'fixed',
          zIndex: 100,
          transition: { duration: 0.3 },
          origin: 'center'
        },
        exit: {
          width: modalRectAtom.width,
          height: modalRectAtom.height,
          left: modalRectAtom.left,
          top: modalRectAtom.top,
          transform: 'translate(0, 0) scale(1)',
          position: 'fixed',
          zIndex: 100,
          transition: { duration: 0.3 },
          origin: 'center'
        }
      }
    : { initial: {}, animate: {}, exit: {} };

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {show && (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm">
            {/* 关闭按钮 */}
            <button
              className="i-mingcute-close-fill absolute left-2 top-2 z-10 rounded-full bg-black/60 p-2 text-3xl text-white transition hover:bg-black/80"
              onClick={handleClose}
              aria-label="关闭"
            ></button>
          </div>
          <motion.img
            src={`${OSS_URL_PREFIX}/${params.album}/${params.image}`}
            alt={params.image}
            className="h-full w-full rounded-sm shadow-lg"
            variants={imageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          />
        </>
      )}
    </AnimatePresence>
  );
}
