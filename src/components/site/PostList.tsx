'use client';

import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import dayjs from '@/lib/dayjs';

export function PostList({ posts, showSearch = true }: { posts: Record<string, any>[]; showSearch?: boolean }) {
  const [searchValue, setSearchValue] = useState('');

  const filteredPosts = useMemo(() => {
    if (!searchValue)
      return posts;
    const lower = searchValue.toLowerCase();
    return posts.filter((post) => {
      return (
        post.title.toLowerCase().includes(lower)
        || post.summary?.toLowerCase().includes(lower)
      );
    });
  }, [posts, searchValue]);

  // Group by year
  const groupedPosts = useMemo(() => {
    const groups: Record<string, typeof posts> = {};
    filteredPosts.forEach((post) => {
      const year = new Date(post.createdTime).getFullYear();
      if (!groups[year])
        groups[year] = [];
      groups[year].push(post);
    });
    return Object.entries(groups).sort((a, b) => Number(b[0]) - Number(a[0]));
  }, [filteredPosts]);

  return (
    <div className="mx-auto max-w-3xl py-12">
      {showSearch && (
        <div className="mb-12 space-y-6">
          <h1 className="text-4xl font-bold tracking-tight">Writing</h1>
          <div className="relative">
            <input
              type="text"
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              placeholder="Search posts..."
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-base outline-none transition-all placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:focus:border-zinc-700 dark:focus:ring-zinc-800"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400">
              <i className="i-mingcute-search-line text-lg" />
            </div>
          </div>
        </div>
      )}

      <div className="space-y-12">
        <AnimatePresence mode="popLayout">
          {groupedPosts.map(([year, yearPosts]) => (
            <motion.section
              key={year}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="mb-6 text-2xl font-bold text-zinc-300 dark:text-zinc-700">{year}</h2>
              <div className="space-y-4">
                {yearPosts.map(post => (
                  <Link
                    key={post.id}
                    href={`/posts/${post.slug}`}
                    className="group block rounded-xl p-4 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                  >
                    <article className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                      <h3 className="text-lg font-medium text-zinc-900 transition-colors group-hover:text-primary dark:text-zinc-100 dark:group-hover:text-primary">
                        {post.title}
                      </h3>
                      <div className="flex shrink-0 items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
                        <time dateTime={new Date(post.createdTime).toISOString()} className="font-mono" suppressHydrationWarning>
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
                ))}
              </div>
            </motion.section>
          ))}
        </AnimatePresence>

        {filteredPosts.length === 0 && (
          <div className="py-12 text-center text-zinc-500">
            No posts found matching "
            {searchValue}
            "
          </div>
        )}
      </div>
    </div>
  );
}
