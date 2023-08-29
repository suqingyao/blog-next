'use client';

import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface PostListProps {
  posts: Frontmatter[];
}

export default function PostList({ posts }: PostListProps) {
  const getYear = (a: Date | string | number) => new Date(a).getFullYear();
  const isFuture = (a?: Date | string | number) =>
    a && new Date(a) > new Date();
  const isSameYear = (a?: Date | string | number, b?: Date | string | number) =>
    a && b && getYear(a) === getYear(b);
  function isSameGroup(a: Frontmatter, b?: Frontmatter) {
    return (
      isFuture(a.date) === isFuture(b?.date) && isSameYear(a.date, b?.date)
    );
  }

  return (
    <div className="my-20">
      {posts.map((post, idx) => (
        <motion.div
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
                staggerChildren: 0.3
              }
            }
          }}
          key={post.slug}
        >
          {!isSameGroup(post, posts[idx - 1]) && (
            <motion.div
              variants={{
                initial: {
                  opacity: 0,
                  y: 10
                },
                animate: {
                  opacity: 1,
                  y: 0
                }
              }}
              className="pointer-events-none relative h-20 select-none"
            >
              <span
                className="absolute -left-[3rem] -top-[2rem] text-[8em] font-bold tracking-wider text-transparent opacity-10"
                style={{
                  WebkitTextStroke: '10px #aaa'
                }}
              >
                {getYear(post.date)}
              </span>
            </motion.div>
          )}
          <motion.div
            variants={{
              initial: {
                opacity: 0,
                y: 10
              },
              animate: {
                opacity: 1,
                y: 0
              }
            }}
          >
            <Link
              href={`/posts/${post.slug}`}
              key={post.slug}
              className="mb-6 mt-2 flex items-center gap-2 opacity-50 transition-opacity hover:opacity-100"
            >
              <span className="text-lg leading-[1.2em]">{post.title}</span>
              <span className="whitespace-nowrap text-sm opacity-50">
                {dayjs(post.date).format('MMM DD, YYYY')}
              </span>
              <span className="whitespace-nowrap text-sm opacity-40">
                {post.readingTime}
              </span>
            </Link>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
