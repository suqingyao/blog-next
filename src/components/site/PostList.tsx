'use client';

import { AnimatePresence, m } from 'motion/react';
import Link from 'next/link';
import { useMemo } from 'react';
import dayjs from '@/lib/dayjs';

interface PostListProps {
  posts: Record<string, any>[];
  showYearHeader?: boolean;
}

export function PostList({ posts, showYearHeader = true }: PostListProps) {
  // Group by year
  const groupedPosts = useMemo(() => {
    const groups: Record<string, typeof posts> = {};
    posts.forEach((post) => {
      const year = new Date(post.createdTime).getFullYear();
      if (!groups[year])
        groups[year] = [];
      groups[year].push(post);
    });
    return Object.entries(groups).sort((a, b) => Number(b[0]) - Number(a[0]));
  }, [posts]);

  // Calculate total posts
  const totalPosts = posts.length;

  return (
    <div className="mx-auto max-w-3xl py-12">
      {/* Header with stats */}
      {showYearHeader && (
        <div className="mb-12 space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Writing</h1>
          <p className="text-base text-zinc-600 dark:text-zinc-400">
            {totalPosts}
            {' '}
            {totalPosts === 1 ? 'post' : 'posts'}
            {' '}
            across
            {' '}
            {groupedPosts.length}
            {' '}
            {groupedPosts.length === 1 ? 'year' : 'years'}
          </p>
        </div>
      )}

      {/* Timeline */}
      <div className="space-y-12">
        <AnimatePresence mode="popLayout">
          {groupedPosts.map(([year, yearPosts]) => (
            <m.section
              key={year}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Year header with count */}
              <div className="mb-6 flex items-baseline gap-3">
                <h2 className="text-2xl font-bold text-zinc-300 dark:text-zinc-700">
                  {year}
                </h2>
                <span className="text-sm text-zinc-400 dark:text-zinc-600">
                  {yearPosts.length}
                  {' '}
                  {yearPosts.length === 1 ? 'post' : 'posts'}
                </span>
              </div>

              {/* Posts in year */}
              <div className="space-y-4">
                {yearPosts.map((post, index) => (
                  <m.div
                    key={post.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <Link
                      href={`/posts/${post.slug}`}
                      className="group block cursor-pointer rounded-xl p-4 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                    >
                      <article className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                        <h3 className="text-lg font-medium text-zinc-900 transition-colors group-hover:text-primary dark:text-zinc-100 dark:group-hover:text-primary">
                          {post.title}
                        </h3>
                        <div className="flex shrink-0 items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
                          <time
                            dateTime={new Date(post.createdTime).toISOString()}
                            className="font-mono"
                            suppressHydrationWarning
                          >
                            {dayjs(post.createdTime).format('MMM DD')}
                          </time>
                          {post.readingTime && (
                            <span className="opacity-0 transition-opacity group-hover:opacity-100">
                              {post.readingTime}
                            </span>
                          )}
                        </div>
                      </article>
                    </Link>
                  </m.div>
                ))}
              </div>
            </m.section>
          ))}
        </AnimatePresence>

        {/* Empty state */}
        {posts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <i className="i-mingcute-file-search-line mb-4 text-4xl text-zinc-300 dark:text-zinc-700" />
            <p className="text-zinc-500 dark:text-zinc-400">No posts yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
