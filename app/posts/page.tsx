import { getAllPostFrontMatter } from '../utils/mdx';
import PostList from './components/PostList';

export default async function Posts() {
  const posts = await getAllPostFrontMatter();

  return (
    <>
      <PostList posts={posts} />
    </>
  );
}
