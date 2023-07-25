'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <motion.section
      initial="initial"
      animate="animate"
      variants={{
        animate: {
          transition: {
            staggerChildren: 0.2,
            duration: 0.5,
            delay: 0.3
          }
        }
      }}
      className="my-10"
    >
      <div className="flex flex-col gap-3 text-5xl font-bold">
        <motion.p
          variants={{
            initial: {
              opacity: 0,
              x: -50
            },
            animate: {
              opacity: 1,
              x: 0
            }
          }}
        >
          👋 Hi, I&apos;m Cully Fung.
        </motion.p>
        <motion.p
          variants={{
            initial: {
              opacity: 0,
              x: -50
            },
            animate: {
              opacity: 1,
              x: 0
            }
          }}
        >
          A front-end developer.
        </motion.p>
      </div>
      <div className="mt-6 flex flex-col gap-1 text-base">
        <motion.p
          variants={{
            initial: {
              opacity: 0,
              x: -50
            },
            animate: {
              opacity: 1,
              x: 0
            }
          }}
        >
          Currently working in Chongqing.{' '}
        </motion.p>
        <motion.p
          variants={{
            initial: {
              opacity: 0,
              x: -50
            },
            animate: {
              opacity: 1,
              x: 0
            }
          }}
        >
          I love coding.
        </motion.p>
      </div>
    </motion.section>
  );
};

export default memo(Hero);
