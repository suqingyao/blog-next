'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export default function Article({ children }: { children: ReactNode }) {
  return (
    <motion.article
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="
        prose-h1:hiddens
        prose
        transition-opacity
        dark:prose-invert
        before:transition-opacity
        prose-headings:opacity-50
        hover:prose-headings:opacity-100
        prose-h2:relative
        prose-h2:before:absolute
        prose-h2:before:-left-[1em]
        prose-h2:before:opacity-0
        prose-h2:before:content-['#']
        hover:prose-h2:before:opacity-100
        prose-pre:bg-[#f8f8f8]
        dark:prose-pre:bg-[#0e0e0e]
      "
    >
      {children}
    </motion.article>
  );
}
