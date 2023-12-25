'use client';

import { motion } from 'framer-motion';

import { sansFont, serifFont } from '@/lib/fonts';
import { cn } from '@/lib/utils';

export default function Prose({ children }: { children: React.ReactNode }) {
  return (
    <motion.article
      initial={{ opacity: 0, marginTop: 50 }}
      animate={{ opacity: 1, marginTop: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className={cn(
        sansFont.variable,
        serifFont.variable,
        'prose dark:prose-invert prose-pre:bg-[#f8f8f8] dark:prose-pre:bg-[#0e0e0e]'
      )}
    >
      {children}
    </motion.article>
  );
}
