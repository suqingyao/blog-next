'use client';

import { AnimatePresence, m } from 'motion/react';
import { useState } from 'react';
import { PostList } from '@/components/site/PostList';
import { cn } from '@/lib/utils';

interface Tag {
  name: string;
  count: number;
}

interface TagListProps {
  tags: Tag[];
  posts: Post[];
}

/**
 * Tags page client component
 * Handles tag filtering interaction logic
 */
export function TagList({ tags, posts }: TagListProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * Filter tags based on search query
   */
  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  /**
   * Filter posts based on selected tag or search query
   */
  const filteredPosts
    = selectedTag === null
      ? (searchQuery
          ? posts.filter(post =>
              post.tags && post.tags.some(tag =>
                tag.toLowerCase().includes(searchQuery.toLowerCase()),
              ),
            )
          : posts)
      : posts.filter(post => post.tags && post.tags.some(tag => tag.toUpperCase() === selectedTag));

  /**
   * Handle tag click event
   * @param tagName Tag name, null means show all
   */
  const handleTagClick = (tagName: string | null) => {
    setSelectedTag(tagName);
  };

  return (
    <div className="space-y-8">
      {/* Tag search and list */}
      <div className="space-y-4">
        <div className="relative max-w-sm">
          <i className="i-mingcute-search-line absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground opacity-50" />
          <input
            type="text"
            placeholder="Search tags..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-full border border-border/50 bg-secondary/30 px-4 pl-10 text-sm focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <m.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleTagClick(null)}
            className={cn(
              'group relative flex items-center rounded-full px-4 py-2 text-sm font-medium transition-colors',
              selectedTag === null
                ? 'bg-primary text-primary-foreground shadow-lg'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
              // 如果有搜索词且没有匹配的标签（虽然"全部"按钮总是显示，但这里为了逻辑一致性可以不做处理）
            )}
          >
            <span>All</span>
            <span
              className={cn(
                'ml-2 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1 text-[10px]',
                selectedTag === null
                  ? 'bg-primary-foreground/20 text-primary-foreground'
                  : 'bg-primary/10 text-primary',
              )}
            >
              {posts.length}
            </span>
          </m.button>

          <AnimatePresence>
            {filteredTags.map(tag => (
              <m.button
                key={tag.name}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleTagClick(tag.name)}
                className={cn(
                  'group relative flex items-center rounded-full px-4 py-2 text-sm font-medium transition-colors uppercase',
                  selectedTag === tag.name
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
                )}
              >
                <i className={cn('i-mingcute-hashtag-fill mr-1 text-base', selectedTag !== tag.name && 'text-primary/70')} />
                <span>{tag.name}</span>
                <span
                  className={cn(
                    'ml-2 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1 text-[10px]',
                    selectedTag === tag.name
                      ? 'bg-primary-foreground/20 text-primary-foreground'
                      : 'bg-primary/10 text-primary',
                  )}
                >
                  {tag.count}
                </span>
              </m.button>
            ))}
          </AnimatePresence>

          {filteredTags.length === 0 && (
            <span className="text-sm text-muted-foreground">No tags found.</span>
          )}
        </div>
      </div>

      <div className="h-px w-full bg-border/50" />

      {/* Post list */}
      <AnimatePresence mode="wait">
        <m.div
          key={selectedTag || 'all'}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold">
              {selectedTag
                ? (
                    <span className="flex items-center gap-2 uppercase">
                      <i className="i-mingcute-hashtag-fill text-primary" />
                      {selectedTag}
                    </span>
                  )
                : (
                    'All Posts'
                  )}
            </h2>
            <span className="text-sm text-muted-foreground">
              {filteredPosts.length}
              {' '}
              {filteredPosts.length === 1 ? 'post' : 'posts'}
            </span>
          </div>

          {filteredPosts.length === 0
            ? (
                <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
                  <i className="i-mingcute-ghost-line mb-4 text-4xl opacity-20" />
                  <p>No posts found with this tag.</p>
                </div>
              )
            : (
                <PostList posts={filteredPosts} showSearch={false} />
              )}
        </m.div>
      </AnimatePresence>
    </div>
  );
}
