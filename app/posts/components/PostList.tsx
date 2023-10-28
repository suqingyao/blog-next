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
      className="my-20"
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
          key={post.slug}
        >
          {!isSameGroup(post, posts[idx - 1]) && (
            <motion.div className="pointer-events-none relative h-20 select-none">
              <span
                className="absolute -left-[3rem] -top-[2rem] text-[8em] font-bold text-transparent opacity-10"
                style={{
                  WebkitTextStrokeWidth: '2px',
                  WebkitTextStrokeColor: '#aaa',
                  lineHeight: '1.75'
                }}
              >
                {getYear(post.date)}
              </span>
            </motion.div>
          )}
          <Link
            href={`/posts/${post.slug}`}
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
        </motion.li>
      ))}
    </motion.ul>
  );
}
