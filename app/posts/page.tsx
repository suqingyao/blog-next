import { getAllPostFrontMatter } from '../utils/mdx';
import PostList from './components/PostList';

export default async function Posts() {
  const posts = await getAllPostFrontMatter();

  return (
    <div className="flex flex-1 flex-col pt-20">
      <PostList posts={posts} />
    </div>
  );
}
