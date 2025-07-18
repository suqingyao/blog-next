import { AppHero } from '@/components/application/app-hero';
import { AppContact, AppLatestPosts } from '@/components/application';

import { getAllPosts } from '@/models/post.model';

export default async function Home() {
  const posts = await getAllPosts();
  const latestPosts = posts.slice(0, 5) as any[];

  return (
    <div className="mx-auto w-[75ch]">
      <AppHero />
      <AppContact />
      <AppLatestPosts posts={latestPosts} />
    </div>
  );
}
