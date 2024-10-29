import { getAllPosts } from '@/models/post.model';
import { PostList } from '@/components/site/post-list';

const PostsPage = async () => {
  const posts = await getAllPosts();

  return <PostList posts={posts} />;
};

export default PostsPage;
