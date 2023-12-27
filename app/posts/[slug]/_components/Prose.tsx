'use client';

import { motion } from 'framer-motion';

export default function Prose({ children }: { children: React.ReactNode }) {
  return (
    <motion.article
      initial={{ opacity: 0, marginTop: 50 }}
      animate={{ opacity: 1, marginTop: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="prose dark:prose-invert"
    >
      {children}
    </motion.article>
  );
}
