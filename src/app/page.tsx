import { AppContact, AppLatestPosts } from '@/components/application';
import { AppHero } from '@/components/application/app-hero';

import { getAllPosts } from '@/models/post.model';

export default async function Home() {
  const posts = await getAllPosts();
  const latestPosts = posts.slice(0, 5) as any[];

  return (
    <div className="content-container">
      <AppHero />
      <AppContact />
      <AppLatestPosts posts={latestPosts} />
    </div>
  );
}
