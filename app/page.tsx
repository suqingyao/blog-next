import { AppHero } from '@/components/application/app-hero';
import { AppContact, AppLatestPosts } from '@/components/application';
import { getAllPost } from '@/utils/mdx';

export default async function Home() {
  const posts = await getAllPost();

  const latestPosts = posts.slice(0, 5);

  return (
    <>
      <AppHero />
      <AppContact />
      <AppLatestPosts posts={latestPosts} />
    </>
  );
}
