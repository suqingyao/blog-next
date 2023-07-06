'use client';

import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  const variants = [];

  return (
    <section className="my-10">
      <div className="flex flex-col gap-3 text-5xl font-bold">
        <motion.p
          initial={{
            x: 50,
            opacity: 0
          }}
          animate={{
            x: 0,
            opacity: 1
          }}
          transition={{
            delay: 0.1,
            duration: 0.5
          }}
        >
          👋 Hi, I&apos;m Cully Fung.
        </motion.p>
        <motion.p
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            delay: 0.2,
            duration: 0.5
          }}
        >
          A front-end developer.
        </motion.p>
      </div>
      <div className="mt-6 flex flex-col gap-1 text-base">
        <motion.p
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            delay: 0.3,
            duration: 0.5
          }}
        >
          Currently working in Chongqing.{' '}
        </motion.p>
        <motion.p
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            delay: 0.4,
            duration: 0.5
          }}
        >
          I love coding.
        </motion.p>
      </div>
    </section>
  );
};

export default Hero;
