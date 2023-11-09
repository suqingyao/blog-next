'use client';

import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';

import { cn } from '@/lib/utils';

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
      className={cn(
        `
          my-10
          flex
        `,
        prev ? 'justify-between' : 'justify-end'
      )}
    >
      {prev && (
        <button
          className="
            group
            flex
            w-64
            cursor-pointer
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
            className="transition-transform group-hover:-translate-x-1"
          />
          <span
            className="truncate"
            title={prev.title}
          >
            {prev.title}
          </span>
        </button>
      )}

      {next && (
        <button
          className="
            group
            flex
            w-64
            cursor-pointer
            justify-between
            gap-2
            rounded-md
            border
            border-gray-500/50
            px-3
            py-2
            transition-colors
          "
          onClick={() => handleTogglePage(next)}
        >
          <span
            className="truncate"
            title={next.title}
          >
            {next.title}
          </span>
          <FiArrowRight
            size={24}
            className="transition-transform group-hover:translate-x-1"
          />
        </button>
      )}
    </div>
  );
}
