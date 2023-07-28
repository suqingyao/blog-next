import React from 'react';
import { getAllPostFrontMatter } from '@/app/utils/mdx';
import LatestPostsList from './LatestPosts.List';

export default async function LatestPosts() {
  const posts = await getAllPostFrontMatter();
  return (
    <div className="my-10">
      <LatestPostsList posts={posts} />
    </div>
  );
}
