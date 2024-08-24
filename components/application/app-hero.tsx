'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Outfit } from 'next/font/google';

const fontMono = Outfit({
  subsets: ['latin'],
  style: 'normal'
});

export const AppHero = () => {
  return (
    <motion.section
      initial="initial"
      animate="animate"
      variants={{
        initial: {
          transition: {
            when: 'afterChildren',
            ease: 'easeInOut'
          }
        },
        animate: {
          transition: {
            when: 'beforeChildren',
            staggerChildren: 0.2,
            ease: 'easeInOut'
          }
        }
      }}
      className={cn(fontMono.className, 'py-10')}
    >
      <div className="flex flex-col gap-2 text-5xl font-extrabold">
        <motion.h1
          variants={{
            initial: {
              opacity: 0,
              y: 50
            },
            animate: {
              opacity: 1,
              y: 0,
              transition: {
                ease: 'easeInOut'
              }
            }
          }}
        >
          {`Hi, `}
        </motion.h1>
        <motion.h1
          variants={{
            initial: {
              opacity: 0,
              y: 50
            },
            animate: {
              opacity: 1,
              y: 0,
              transition: {
                ease: 'easeInOut'
              }
            }
          }}
        >
          {`I'm SuQingyao .`}
        </motion.h1>

        <motion.p
          variants={{
            initial: {
              opacity: 0,
              y: 50
            },
            animate: {
              opacity: 1,
              y: 0,
              transition: {
                ease: 'easeInOut'
              }
            }
          }}
        >
          FrontEnd Developer .
        </motion.p>
      </div>

      <motion.p
        variants={{
          initial: {
            opacity: 0
          },
          animate: {
            opacity: 1,
            transition: {
              ease: 'easeInOut'
            }
          }
        }}
        className="mt-6 text-base"
      >
        Currently live in Chongqing, China.
      </motion.p>
      <motion.p
        variants={{
          initial: {
            opacity: 0
          },
          animate: {
            opacity: 1,
            transition: {
              ease: 'easeInOut'
            }
          }
        }}
        className="text-base"
      >
        Loves music and programming and is introverted.
      </motion.p>
    </motion.section>
  );
};
