import { getAllPostFrontMatter } from '@/utils/mdx';
import PostList from './_components/PostList';

export default async function Posts() {
  const posts = await getAllPostFrontMatter();

  return (
    <>
      <PostList posts={posts} />
    </>
  );
}
