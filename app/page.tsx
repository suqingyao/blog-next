import Hero from './components/Hero';
import Social from './components/Social';
import LatestPosts from './components/LatestPosts';
import { getAllPostFrontMatter } from './utils/mdx';

export default async function Home() {
  const posts = await getAllPostFrontMatter();

  return (
    <div className="flex-1 pt-[60px]">
      <Hero />
      <Social />
      <LatestPosts posts={posts} />
    </div>
  );
}
