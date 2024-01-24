import { AppHero } from '@/components/app-hero';
import { Contact } from '@/components/contact';
import { LatestPosts } from '@/components/latest-posts';
import { getAllPost } from '@/utils/mdx';

export default async function Home() {
  const posts = await getAllPost();

  const latestPosts = posts.slice(0, 5);

  return (
    <>
      <AppHero />
      <Contact />
      <LatestPosts posts={latestPosts} />
    </>
  );
}
