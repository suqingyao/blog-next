'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import React from 'react';

import { IoLogoTwitter, IoLogoGithub } from 'react-icons/io';
import { FaBilibili } from 'react-icons/fa6';

export default function Social() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 1 }}
      className="flex items-center gap-5"
    >
      <Link
        href="https://twitter.com/cully_fung"
        className="
          rounded-md
          p-2
          text-blue-400
          transition-all
          hover:border-blue-400
          hover:bg-blue-400
          hover:text-white
        "
      >
        <IoLogoTwitter size={28} />
      </Link>
      <Link
        href="https://github.com/cullyfung"
        className="
          rounded-md
          p-2
          text-black
          transition-all
          hover:bg-black
          hover:text-white
          dark:text-white
          dark:hover:bg-white
          dark:hover:text-black
        "
      >
        <IoLogoGithub size={28} />
      </Link>
      <Link
        href="https://space.bilibili.com/27022081"
        className="
          rounded-md
          p-2
          text-primary
          transition-all
          hover:bg-primary
          hover:text-white
        "
      >
        <FaBilibili size={28} />
      </Link>
    </motion.div>
  );
}
