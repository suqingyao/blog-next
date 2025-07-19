'use client';

import Link from 'next/link';
import { motion } from 'motion/react';

import dayjs from '@/lib/dayjs';
import { cn } from '@/lib/utils';

export const AppLatestPosts = ({ posts }: { posts: Post[] }) => {
  return (
    <div className={cn('py-4 font-mono')}>
      <motion.div
        layout
        className="flex items-center justify-between"
      >
        <motion.h2
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            duration: 0.5
          }}
          className="text-3xl font-semibold"
        >
          Latest Posts
        </motion.h2>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Link
            href={'/posts'}
            className="opacity-50 hover:opacity-100"
          >
            <span className="i-mingcute-arrow-right-up-line text-2xl" />
          </Link>
        </motion.div>
      </motion.div>
      <motion.ul
        initial="initial"
        animate="animate"
        variants={{
          initial: {
            transition: {
              when: 'afterChildren'
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
        className="my-4 flex flex-col gap-2"
      >
        {posts.map((post, index) => (
          <Card
            post={post}
            delay={index * 0.06}
            key={post.slug}
          />
        ))}
      </motion.ul>
    </div>
  );
};

export function Card({ post, delay }: { post: Post; delay: number }) {
  return (
    <motion.li
      variants={{
        initial: {
          opacity: 0,
          y: 10
        },
        animate: {
          opacity: 1,
          y: 0,
          transition: {
            ease: 'easeInOut',
            delay
          }
        }
      }}
    >
      <Link
        href={`/posts/${post.id}`}
        className="block rounded-md p-3 transition-colors hover:bg-neutral-400/10 dark:hover:bg-neutral-800/10"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">{post.title}</div>
          <div className="hidden font-normal opacity-40 sm:block">
            {dayjs(post.createdTime).format('MMM DD, YYYY')}
          </div>
        </div>
      </Link>
    </motion.li>
  );
}
