'use client';

import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import React, { useMemo } from 'react';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';

interface PagerProps {
  posts: Frontmatter[];
}

export default function Pager({ posts }: PagerProps) {
  const { slug } = useParams();
  const router = useRouter();

  const current = useMemo(
    () => posts.findIndex((post) => post.slug === slug),
    [slug, posts]
  );

  const nextPost = useMemo(() => {
    if (current + 1 > posts.length) {
      return null;
    }
    return posts[current + 1];
  }, [current, posts]);

  const prevPost = useMemo(() => {
    if (current - 1 < 0) {
      return null;
    }
    return posts[current - 1];
  }, [current, posts]);

  const handleTogglePage = (post: Frontmatter) => {
    router.push(`/posts/${post?.slug}`);
  };

  return (
    <div
      className={clsx(
        `
          mt-10 
          flex 
          items-center
          border-t 
          border-t-gray-300 
          px-2 
          py-3
        `,
        prevPost ? 'justify-between' : 'justify-end'
      )}
    >
      {prevPost && (
        <button
          className="
            flex
            w-64
            cursor-pointer
            flex-row
            items-center 
            gap-2
            rounded-md 
            border
            border-black/10
            px-3
            py-2
            transition-colors
          "
          onClick={() => handleTogglePage(prevPost)}
        >
          <FiArrowLeft size={24} />
          <span>{prevPost.title}</span>
        </button>
      )}

      {nextPost && (
        <button
          className="
            flex
            w-64
            cursor-pointer
            flex-row
            items-center
            justify-between
            gap-2
            rounded-md
            border
            border-black/10
            px-3
            py-2
            transition-colors
          "
          onClick={() => handleTogglePage(nextPost)}
        >
          <span>{nextPost.title}</span>
          <motion.span
            initial={{ x: 0 }}
            animate={{ x: 10 }}
            transition={{ duration: 0.2 }}
          >
            <FiArrowRight size={24} />
          </motion.span>
        </button>
      )}
    </div>
  );
}
