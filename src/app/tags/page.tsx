import { getAllTags, getAllPosts } from '@/models/post.model';
import { TagList } from '@/components/site/TagList';

/**
 * Tags page server component
 * Fetches all tags and posts data on the server, then passes to client component for interaction
 */
export default async function TagsPage() {
  const [tags, posts] = await Promise.all([getAllTags(), getAllPosts()]);

  return (
    <div className="content-container">
      <h1 className="mb-8 text-3xl font-bold">Tags</h1>
      <TagList
        tags={tags}
        posts={posts as Post[]}
      />
    </div>
  );
}
