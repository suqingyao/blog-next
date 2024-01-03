'use client';

import { motion } from 'framer-motion';

const Hero = () => {
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
            staggerChildren: 0.3,
            ease: 'easeInOut'
          }
        }
      }}
      className="py-10"
    >
      <div className="flex flex-col gap-5 text-5xl">
        <div className="flex items-center gap-2">
          <motion.span
            initial={{
              rotate: 0
            }}
            animate={{
              rotate: [15, -15, 15, -15, 0]
            }}
            transition={{
              duration: 1,
              delay: 1
            }}
            className="origin-bottom"
          >
            👋
          </motion.span>
          <motion.p
            variants={{
              initial: {
                opacity: 0,
                x: -50
              },
              animate: {
                opacity: 1,
                x: 0,
                transition: {
                  ease: 'easeInOut'
                }
              }
            }}
          >
            Hi, I&apos;m <span className="font-semibold">Cully Fung</span>.
          </motion.p>
        </div>

        <motion.p
          variants={{
            initial: {
              opacity: 0,
              x: -50
            },
            animate: {
              opacity: 1,
              x: 0,
              transition: {
                ease: 'easeInOut'
              }
            }
          }}
        >
          A FrontEnd
          <span className="ml-2 rounded-lg p-1 font-mono font-semibold transition-colors hover:bg-[var(--highlighted-bg-color)]">
            &lt;Developer /&gt;
          </span>
        </motion.p>
      </div>
      <div className="mt-6 flex flex-col gap-1 text-base">
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
          transition={{
            duration: 2,
            delay: 1
          }}
        >
          Currently live in Chongqing.
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
          transition={{
            duration: 2,
            delay: 1
          }}
        >
          Like listening to music and coding.
        </motion.p>
      </div>
    </motion.section>
  );
};

export default Hero;
