'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import dayjs from '@/lib/dayjs';

export const PostList = ({ posts }: { posts: Record<string, any>[] }) => {
  const getYear = (a: Date | string | number) => new Date(a).getFullYear();
  const isSameYear = (a?: Date | string | number, b?: Date | string | number) =>
    a && b && getYear(a) === getYear(b);
  function isSameGroup(a: Post, b?: Post) {
    return !!isSameYear(a.createdTime, b?.createdTime);
  }

  return (
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
            staggerChildren: 0.2
          }
        }
      }}
    >
      {posts.map((post, idx) => (
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
                delay: idx * 0.06,
                ease: 'easeInOut'
              }
            }
          }}
          key={post.id}
        >
          {!isSameGroup(post as Post, posts[idx - 1] as Post | undefined) && (
            <motion.div className="pointer-events-none relative h-20 select-none">
              <span className="absolute -left-12 -top-8 text-stroke text-[8em] font-bold text-black/100 opacity-10 font-inter">
                {getYear(post.createdTime)}
              </span>
            </motion.div>
          )}
          <Link
            href={`/posts/${post.id}`}
            className="mb-6 mt-2 flex items-center gap-2 opacity-50 transition-opacity hover:opacity-100"
          >
            <span className="text-lg leading-[1.2em]">{post.title}</span>
            <span className="whitespace-nowrap text-sm opacity-50">
              {dayjs(post.createdTime).format('MMM DD, YYYY')}
            </span>
            <span className="whitespace-nowrap text-sm opacity-40">
              {post.readingTime}
            </span>
          </Link>
        </motion.li>
      ))}
    </motion.ul>
  );
};
