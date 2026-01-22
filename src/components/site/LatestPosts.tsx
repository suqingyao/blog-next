'use client';

import { m } from 'motion/react';
import Link from 'next/link';
import { useState } from 'react';

import { SpotlightCard } from '@/components/ui/spotlight-card';
import dayjs from '@/lib/dayjs';

export function LatestPosts({ posts }: { posts: Post[] }) {
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
  const [isHovered, setIsHovered] = useState(false);

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="h-full"
    >
      <SpotlightCard
        className="group relative flex h-full flex-col gap-3 border-zinc-200/50 bg-zinc-50/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-zinc-300 dark:border-zinc-800/50 dark:bg-zinc-900/50 dark:hover:border-zinc-700"
        spotlightColor="rgba(139, 92, 246, 0.15)"
      >
        {/* Tag badge */}
        {post.tags?.[0] && (
          <div className="absolute right-4 top-4">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary transition-colors group-hover:bg-primary/20 dark:bg-primary/20 dark:group-hover:bg-primary/30">
              {post.tags[0]}
            </span>
          </div>
        )}

        {/* Date */}
        <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <i className="i-mingcute-calendar-line text-base" />
          <time dateTime={new Date(post.createdTime).toISOString()} suppressHydrationWarning>
            {dayjs(post.createdTime).format('MMM DD, YYYY')}
          </time>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold tracking-tight text-zinc-900 transition-colors group-hover:text-primary dark:text-zinc-100 dark:group-hover:text-primary">
          <Link href={`/posts/${post.slug}`}>
            <span className="absolute inset-0" />
            {post.title}
          </Link>
        </h3>

        {/* Summary */}
        {post.summary && (
          <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {post.summary.replace(/^AI摘要：/, '')}
          </p>
        )}

        {/* Read more indicator */}
        <div className="flex items-center gap-2 pt-2 text-sm font-medium text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span>Read more</span>
          <i
            className={`i-mingcute-arrow-right-line transition-transform duration-300 ${
              isHovered ? 'translate-x-1' : ''
            }`}
          />
        </div>
      </SpotlightCard>
    </m.div>
  );
}
