import Hero from '@/components/Hero';
import Social from '@/components/Social';
import LatestPosts from '@/components/LatestPosts';
import { getAllPost } from '@/utils/mdx';

export default async function Home() {
  const posts = await getAllPost();

  const latestPosts = posts.slice(0, 5);

  return (
    <>
      <Hero />
      <Social />
      <LatestPosts posts={latestPosts} />
    </>
  );
}
