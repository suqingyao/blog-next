'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

import { FaXTwitter, FaGithub } from 'react-icons/fa6';
import { IoLogoWechat, IoMail } from 'react-icons/io5';

export default function Social() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 1 }}
      className="flex flex-col gap-5"
    >
      <div className="flex items-center">
        <FaXTwitter size={24} />
        <Link
          href="https://twitter.com/cully_fung"
          className="text-link ml-2"
        >
          https://twitter.com/cully_fung
        </Link>
      </div>
      <div className="flex items-center">
        <FaGithub size={24} />
        <Link
          href="https://github.com/cullyfung"
          className="text-link ml-2"
        >
          https://github.com/cullyfung
        </Link>
      </div>
      <div className="flex items-center">
        <IoLogoWechat size={24} />
        <span className="text-link ml-2">cullyfung</span>
      </div>
      <div className="flex items-center">
        <IoMail size={24} />
        <span className="text-link ml-2">cullyfung@gmail.com</span>
      </div>
    </motion.div>
  );
}
