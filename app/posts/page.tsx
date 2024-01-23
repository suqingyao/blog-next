import { getAllPost } from '@/utils/mdx';
import { PostList } from './_components/PostList';

export default async function Posts() {
  const posts = await getAllPost();

  return (
    <>
      <PostList posts={posts} />
    </>
  );
}
