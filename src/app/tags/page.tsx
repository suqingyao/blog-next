import { TagCloud } from '@/components/site/TagCloud';
import { getAllPosts, getAllTags } from '@/models/post.model';

/**
 * Tags page server component
 * Fetches all tags and posts data on the server, then passes to client component for interaction
 */
export default async function TagsPage() {
  const [tags, posts] = await Promise.all([getAllTags(), getAllPosts()]);

  return (
    <div className="content-container">
      <TagCloud
        tags={tags}
        posts={posts as Post[]}
      />
    </div>
  );
}
