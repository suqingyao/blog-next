'use client';

import { AnimatePresence, m } from 'motion/react';
import { useMemo, useState } from 'react';
import { PostList } from '@/components/site/PostList';
import { cn } from '@/lib/utils';

interface Tag {
  name: string;
  count: number;
}

interface TagCloudProps {
  tags: Tag[];
  posts: Post[];
}

/**
 * Bento Grid Tag Cloud - Elegant, modern card layout
 * Inspired by Apple's design language with refined aesthetics
 */
export function TagCloud({ tags, posts }: TagCloudProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Sort tags by count and assign grid sizes
  const gridTags = useMemo(() => {
    const sorted = [...tags].sort((a, b) => b.count - a.count);

    // Define grid sizes (span classes)
    const sizePattern = ['large', 'large', 'medium', 'medium', 'small', 'small', 'small', 'medium'];

    return sorted.map((tag, index) => ({
      ...tag,
      gridSize: sizePattern[index % sizePattern.length],
    }));
  }, [tags]);

  // Filter posts based on selected tag
  const filteredPosts = useMemo(() => {
    if (selectedTag === null)
      return posts;
    return posts.filter(post =>
      post.tags && post.tags.some(tag => tag.toUpperCase() === selectedTag),
    );
  }, [posts, selectedTag]);

  // Color palette - soft, refined colors
  const getTagColor = (index: number) => {
    const colors = [
      { bg: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200/50 dark:border-blue-800/30' },
      { bg: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-200/50 dark:border-purple-800/30' },
      { bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/20', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200/50 dark:border-emerald-800/30' },
      { bg: 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/20', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-200/50 dark:border-orange-800/30' },
      { bg: 'bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950/30 dark:to-pink-900/20', text: 'text-pink-700 dark:text-pink-300', border: 'border-pink-200/50 dark:border-pink-800/30' },
      { bg: 'bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-950/30 dark:to-teal-900/20', text: 'text-teal-700 dark:text-teal-300', border: 'border-teal-200/50 dark:border-teal-800/30' },
      { bg: 'bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/30 dark:to-indigo-900/20', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-200/50 dark:border-indigo-800/30' },
      { bg: 'bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-950/30 dark:to-rose-900/20', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-200/50 dark:border-rose-800/30' },
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-4xl font-bold tracking-tight">Explore Topics</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          {selectedTag
            ? (
                <>
                  <span className="font-semibold uppercase text-primary">
                    #
                    {selectedTag}
                  </span>
                  {' '}
                  •
                  {' '}
                  {filteredPosts.length}
                  {' '}
                  {filteredPosts.length === 1 ? 'article' : 'articles'}
                </>
              )
            : (
                <>
                  {tags.length}
                  {' '}
                  topics
                  {' '}
                  •
                  {' '}
                  {posts.length}
                  {' '}
                  articles
                </>
              )}
        </p>
      </div>

      {/* Reset button */}
      <AnimatePresence>
        {selectedTag && (
          <m.button
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onClick={() => setSelectedTag(null)}
            className="flex cursor-pointer items-center gap-2 rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all hover:bg-zinc-800 hover:shadow-xl dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            <i className="i-mingcute-close-line" />
            <span>Clear filter</span>
          </m.button>
        )}
      </AnimatePresence>

      {/* Bento Grid */}
      {!selectedTag && (
        <div className="grid auto-rows-[160px] grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {gridTags.map((tag, index) => {
            const colors = getTagColor(index);
            return (
              <m.button
                key={tag.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                onClick={() => setSelectedTag(tag.name)}
                className={cn(
                  'group relative cursor-pointer overflow-hidden rounded-3xl border backdrop-blur-sm transition-all',
                  'hover:scale-[1.02] hover:shadow-2xl',
                  colors.bg,
                  colors.border,
                  // Grid spans
                  tag.gridSize === 'large' && 'col-span-2 row-span-2',
                  tag.gridSize === 'medium' && 'col-span-2 row-span-1',
                  tag.gridSize === 'small' && 'col-span-1 row-span-1',
                )}
              >
                {/* Content */}
                <div className="flex h-full flex-col items-start justify-between p-6">
                  {/* Tag info */}
                  <div className="space-y-2">
                    <div className={cn('flex items-center gap-2', colors.text)}>
                      <i className="i-mingcute-hashtag-fill text-xl" />
                      <span className="text-sm font-medium uppercase tracking-wide opacity-60">
                        Tag
                      </span>
                    </div>
                    <h3 className={cn('text-2xl font-bold uppercase', colors.text)}>
                      {tag.name}
                    </h3>
                  </div>

                  {/* Post count */}
                  <div className={cn('flex items-baseline gap-2', colors.text)}>
                    <span className="text-3xl font-bold">{tag.count}</span>
                    <span className="text-sm opacity-60">
                      {tag.count === 1 ? 'post' : 'posts'}
                    </span>
                  </div>
                </div>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/20 opacity-0 transition-opacity group-hover:opacity-100 dark:from-white/0 dark:to-white/5" />

                {/* Corner accent */}
                <div className={cn(
                  'absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-10 transition-transform group-hover:scale-150',
                  colors.bg,
                )}
                />
              </m.button>
            );
          })}
        </div>
      )}

      {/* Post list */}
      <AnimatePresence mode="wait">
        {selectedTag && (
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6 flex items-center justify-between border-b border-zinc-200 pb-4 dark:border-zinc-800">
              <h2 className="flex items-center gap-2 text-2xl font-bold uppercase">
                <i className="i-mingcute-hashtag-fill text-primary" />
                {selectedTag}
              </h2>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                {filteredPosts.length}
                {' '}
                {filteredPosts.length === 1 ? 'post' : 'posts'}
              </span>
            </div>

            {filteredPosts.length === 0
              ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <i className="i-mingcute-ghost-line mb-4 text-4xl text-zinc-300 dark:text-zinc-700" />
                    <p className="text-zinc-500 dark:text-zinc-400">No posts found</p>
                  </div>
                )
              : (
                  <PostList posts={filteredPosts} showYearHeader={false} />
                )}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
