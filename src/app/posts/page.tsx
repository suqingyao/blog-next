import { getAllPosts } from '@/models/post.model';
import { PostList } from '@/components/site/post-list';

const PostsPage = async () => {
  const posts = await getAllPosts();

  return (
    <div className="mx-auto w-[75ch]">
      <PostList posts={posts} />
    </div>
  );
};

export default PostsPage;
