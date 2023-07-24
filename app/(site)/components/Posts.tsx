'use client';

import Link from 'next/link';
import React from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { RiArrowRightUpLine } from 'react-icons/ri';

export default function Posts() {
  const posts: Post[] = [
    {
      path: '/',
      slug: 'sss',
      frontmatter: {
        date: new Date(),
        title: 'hello'
      }
    }
  ];

  return (
    <div className="my-10">
      <motion.div layout className="flex items-center justify-between">
        <motion.h2
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            delay: 0.5,
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
          <Link href={'/posts'} className="opacity-50 hover:opacity-100">
            <RiArrowRightUpLine size={28} />
          </Link>
        </motion.div>
      </motion.div>
      <motion.div
        initial="initial"
        animate="animate"
        variants={{
          animate: {
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
        className="mt-8 flex flex-col gap-2"
      >
        {posts.map((item, index) => (
          <Card post={item} key={index} />
        ))}
      </motion.div>
    </div>
  );
}

export function Card({ post }: { post: Post }) {
  return (
    <motion.div
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
      <Link
        href={`/posts/${post.slug}`}
        className="
        block
        rounded-md
        px-3
        py-3
        transition-colors
        hover:bg-gray-100
        dark:hover:bg-gray-50/10
       "
      >
        <div
          className="
          flex 
          items-center 
          justify-between
        "
        >
          <div className="flex-1">{post.frontmatter.title}</div>
          <div
            className="
            hidden 
            font-normal 
            opacity-40 
            sm:block
          "
          >
            {format(post.frontmatter.date, 'yyyy-MM-dd')}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
