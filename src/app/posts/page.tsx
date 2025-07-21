import { getAllPosts } from '@/models/post.model';
import { PostList } from '@/components/site/PostList';

const PostsPage = async () => {
  const posts = await getAllPosts();

  return (
    <div className="mx-auto w-[75ch] font-sans">
      <PostList posts={posts} />
    </div>
  );
};

export default PostsPage;
