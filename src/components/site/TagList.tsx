'use client';

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

  /**
   * Filter posts based on selected tag
   */
  const filteredPosts =
    selectedTag === null
      ? posts
      : posts.filter((post) => post.tags && post.tags.includes(selectedTag));

  /**
   * Handle tag click event
   * @param tagName Tag name, null means show all
   */
  const handleTagClick = (tagName: string | null) => {
    setSelectedTag(tagName);
  };

  return (
    <>
      {/* Tag filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-x-8 gap-y-4">
          <button
            onClick={() => handleTagClick(null)}
            className={cn(
              'rounded-md text-lg opacity-50 transition-opacity hover:opacity-100',
              selectedTag === null && 'opacity-100'
            )}
          >
            All ({posts.length})
          </button>
          {tags.map((tag) => (
            <button
              key={tag.name}
              onClick={() => handleTagClick(tag.name)}
              className={cn(
                'flex cursor-pointer items-center text-xl opacity-50 transition-opacity hover:opacity-100',
                selectedTag === tag.name && 'opacity-100'
              )}
            >
              <i className="i-mingcute-hashtag-fill text-primary mr-1" />
              <span className="font-semibold uppercase">{tag.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Post list */}
      <div>
        {filteredPosts.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center">
            {selectedTag ? (
              <span>
                No posts found with tag{' '}
                <i className="i-mingcute-hashtag-fill text-primary mr-1 ml-2" />
                <span className="">{selectedTag}</span>
              </span>
            ) : (
              'No posts available'
            )}
          </p>
        ) : (
          <>
            <p className="text-muted-foreground mb-6">
              {selectedTag ? (
                <span className="flex items-center">
                  {filteredPosts.length} posts with tag
                  <i className="i-mingcute-hashtag-fill text-primary mr-1 ml-2" />
                  <span className="">{selectedTag}</span>
                </span>
              ) : (
                `${filteredPosts.length} posts in total`
              )}
            </p>
            <PostList
              key={selectedTag || 'all'}
              posts={filteredPosts}
            />
          </>
        )}
      </div>
    </>
  );
}
