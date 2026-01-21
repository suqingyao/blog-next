import { Hero, LatestPosts } from '@/components/site';

import { getAllPosts } from '@/models/post.model';

export default async function Home() {
  const posts = await getAllPosts();
  const latestPosts = posts.slice(0, 4) as any[];

  return (
    <div className="content-container space-y-16 py-8 md:py-12">
      <Hero />
      <LatestPosts posts={latestPosts} />
    </div>
  );
}
