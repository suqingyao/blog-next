'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export default function Prose({ children }: { children: ReactNode }) {
  return (
    <motion.article
      initial={{ opacity: 0, marginTop: 50 }}
      animate={{ opacity: 1, marginTop: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="
        prose
        dark:prose-invert
        prose-pre:bg-[#f8f8f8]
        dark:prose-pre:bg-[#0e0e0e]
      "
    >
      {children}
    </motion.article>
  );
}
