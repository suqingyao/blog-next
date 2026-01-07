'use client';

import { motion } from 'motion/react';
import Link from 'next/link';

import dayjs from '@/lib/dayjs';

export function AppLatestPosts({ posts }: { posts: any[] }) {
  return (
    <section className="py-12">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Latest Writing</h2>
        <Link
          href="/posts"
          className="group flex items-center gap-1 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          View all
          <span className="i-mingcute-arrow-right-line transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {posts.map((post, index) => (
          <PostCard key={post.slug} post={post} index={index} />
        ))}
      </div>
    </section>
  );
}

function PostCard({ post, index }: { post: any; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative flex flex-col gap-3 rounded-2xl bg-zinc-50 p-6 transition-colors hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800/80"
    >
      <div className="flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
        <time dateTime={post.createdTime}>
          {dayjs(post.createdTime).format('MMM DD, YYYY')}
        </time>
        {post.tags?.[0] && (
          <>
            <span>•</span>
            <span className="font-medium text-zinc-600 dark:text-zinc-300">
              {post.tags[0]}
            </span>
          </>
        )}
      </div>
      <h3 className="text-lg font-semibold tracking-tight text-zinc-900 group-hover:text-primary dark:text-zinc-100 dark:group-hover:text-primary">
        <Link href={`/posts/${post.slug}`}>
          <span className="absolute inset-0" />
          {post.title}
        </Link>
      </h3>
      {post.summary && (
        <p className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
          {post.summary.replace(/^AI摘要：/, '')}
        </p>
      )}
    </motion.div>
  );
}
