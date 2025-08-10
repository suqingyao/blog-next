import { PostList } from '@/components/site/PostList';
import { getAllPosts } from '@/models/post.model';

async function PostsPage() {
  const posts = await getAllPosts();

  return (
    <div className="content-container">
      <PostList posts={posts} />
    </div>
  );
}

export default PostsPage;
