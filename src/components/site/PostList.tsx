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
              <span className="text-stroke font-inter absolute -top-8 -left-12 text-[8em] font-bold text-black/200 opacity-10">
                {getYear(post.createdTime)}
              </span>
            </motion.div>
          )}
          <Link
            href={`/posts/${post.id}`}
            className="mt-2 mb-6 flex items-center gap-2 opacity-50 transition-opacity hover:opacity-100"
          >
            <span className="text-lg leading-[1.2em]">{post.title}</span>
            <span className="text-sm whitespace-nowrap opacity-50">
              {dayjs(post.createdTime).format('MMM DD, YYYY')}
            </span>
            <span className="text-sm whitespace-nowrap opacity-40">
              {post.readingTime}
            </span>
          </Link>
        </motion.li>
      ))}
    </motion.ul>
  );
};
