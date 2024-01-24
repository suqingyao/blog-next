import { getAllPost } from '@/utils/mdx';
import { PostList } from './_components/post-list';

const PostsPage = async () => {
  const posts = await getAllPost();

  return (
    <>
      <PostList posts={posts} />
    </>
  );
};

export default PostsPage;
