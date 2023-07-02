'use client';

import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="my-10">
      <div className="flex flex-col gap-3 text-5xl font-bold">
        <motion.p>👋 Hi, I&apos;m Cully Fung.</motion.p>
        <motion.p>A front-end developer.</motion.p>
      </div>
      <div className="mt-6 flex flex-col gap-1 text-base">
        <motion.p>Currently working in Chongqing. </motion.p>
        <motion.p>I love coding.</motion.p>
      </div>
    </section>
  );
};

export default Hero;
