import Link from 'next/link';
import React from 'react';
import { format } from 'date-fns';

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
      <h2 className="text-3xl font-semibold">Latest Posts</h2>
      <div className="mt-8 flex flex-col gap-2">
        {posts.map((item, index) => (
          <Card key={index} post={item} />
        ))}
      </div>
    </div>
  );
}

export function Card({ post }: { post: Post }) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="block rounded-md px-3 py-3 transition-colors hover:bg-gray-100 dark:hover:bg-gray-50/10"
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
