import Link from 'next/link';
import React from 'react';
import { format } from 'date-fns';

export default function Posts() {
  return <div></div>;
}

export function Card(post: Post) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="rounded-md px-3 py-3 transition-colors hover:bg-gray-100 dark:hover:bg-gray-50/10"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">{post.frontmatter.title}</div>
        <div className="hidden font-normal opacity-40 sm:block">
          {format(post.frontmatter.date, 'yyyy-MM-dd')}
        </div>
      </div>
    </Link>
  );
}
