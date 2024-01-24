import Link from 'next/link';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';

import { cn } from '@/lib/utils';

type PaginationProps = {
  prev?: Post;
  next?: Post;
};

export const Pagination = ({ prev, next }: PaginationProps) => {
  return (
    <div
      className={cn(
        'my-10 flex items-start',
        prev ? 'justify-between' : 'justify-end'
      )}
    >
      {prev && (
        <Link
          role="button"
          href={`/posts/${prev?.id}`}
          className="group flex w-64 cursor-pointer gap-2 rounded-md border border-gray-500/50 px-3 py-2 transition-colors"
        >
          <FiArrowLeft
            size={24}
            className="transition-transform group-hover:-translate-x-1"
          />
          <span title={prev.title}>{prev.title}</span>
        </Link>
      )}

      {next && (
        <Link
          role="button"
          href={`/posts/${next?.id}`}
          className="group flex w-64 cursor-pointer justify-between gap-2 rounded-md border border-gray-500/50 px-3 py-2 transition-colors"
        >
          <span title={next.title}>{next.title}</span>
          <FiArrowRight
            size={24}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>
      )}
    </div>
  );
};
