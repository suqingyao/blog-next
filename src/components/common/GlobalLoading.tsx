'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { GooeyLoading } from '@/components/ui/gooey-loading';

export function GlobalLoading() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 监听 body 的变化，检测 nprogress 元素
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          const nprogress = document.getElementById('nprogress');
          if (nprogress) {
            setIsLoading(true);
          } else {
            // 给一个小延迟，确保动画平滑结束
            setTimeout(() => setIsLoading(false), 200);
          }
        }
      }
    });

    observer.observe(document.body, { childList: true });

    return () => observer.disconnect();
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-black/80"
        >
          <GooeyLoading />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
