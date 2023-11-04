import { getAllPostFrontMatter } from '../utils/mdx';
import PostList from './components/PostList';

export default async function Posts() {
  const posts = await getAllPostFrontMatter();

  return (
    <div className="flex flex-1 flex-col pt-[60px]">
      <PostList posts={posts} />
    </div>
  );
}
