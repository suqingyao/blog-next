'use client';

import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import React from 'react';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';

interface PagerProps {
  prev: Frontmatter;
  next: Frontmatter;
}

export default function Pager({ prev, next }: PagerProps) {
  const router = useRouter();

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
          px-2
          py-3
        `,
        prev ? 'justify-between' : 'justify-end'
      )}
    >
      {prev && (
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
            border-gray-500/50
            px-3
            py-2
            transition-colors
          "
          onClick={() => handleTogglePage(prev)}
        >
          <FiArrowLeft
            size={24}
            className="transition-transform hover:-translate-x-1"
          />
          <span>{prev.title}</span>
        </button>
      )}

      {next && (
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
            border-gray-500/50
            px-3
            py-2
            transition-colors
            peer-hover:translate-x-1
          "
          onClick={() => handleTogglePage(next)}
        >
          <span>{next.title}</span>
          <FiArrowRight size={24} className="peer transition-transform" />
        </button>
      )}
    </div>
  );
}
