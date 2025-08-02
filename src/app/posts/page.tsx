import { getAllPosts } from '@/models/post.model';
import { PostList } from '@/components/site/PostList';

const PostsPage = async () => {
  const posts = await getAllPosts();

  return (
    <div className="content-container">
      <PostList posts={posts} />
    </div>
  );
};

export default PostsPage;
