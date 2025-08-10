'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export function AppHero() {
  return (
    <motion.section
      initial="initial"
      animate="animate"
      variants={{
        initial: {
          transition: {
            when: 'afterChildren',
            ease: 'easeInOut',
          },
        },
        animate: {
          transition: {
            when: 'beforeChildren',
            staggerChildren: 0.2,
            ease: 'easeInOut',
          },
        },
      }}
      className={cn('py-6 font-mono')}
    >
      <div className="flex flex-col gap-5 text-5xl font-extrabold">
        <motion.h1
          variants={{
            initial: {
              opacity: 0,
              y: 50,
            },
            animate: {
              opacity: 1,
              y: 0,
              transition: {
                ease: 'easeInOut',
              },
            },
          }}
        >
          {`Hi, `}
        </motion.h1>
        <motion.h1
          variants={{
            initial: {
              opacity: 0,
              y: 50,
            },
            animate: {
              opacity: 1,
              y: 0,
              transition: {
                ease: 'easeInOut',
              },
            },
          }}
        >
          {`I'm SuQingyao .`}
        </motion.h1>

        <motion.p
          variants={{
            initial: {
              opacity: 0,
              y: 50,
            },
            animate: {
              opacity: 1,
              y: 0,
              transition: {
                ease: 'easeInOut',
              },
            },
          }}
        >
          FrontEnd Developer .
        </motion.p>
      </div>

      <motion.p
        variants={{
          initial: {
            opacity: 0,
          },
          animate: {
            opacity: 1,
            transition: {
              ease: 'easeInOut',
            },
          },
        }}
        className="mt-6 text-base"
      >
        Currently live in Chongqing, China.
      </motion.p>
      <motion.p
        variants={{
          initial: {
            opacity: 0,
          },
          animate: {
            opacity: 1,
            transition: {
              ease: 'easeInOut',
            },
          },
        }}
        className="text-base"
      >
        Loves music and programming and is introverted.
      </motion.p>
    </motion.section>
  );
}
