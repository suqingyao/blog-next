import { notFound } from 'next/navigation';

import { getAdjacentPosts, getAllPost, getPostById } from '@/utils/mdx';

import { PageContent } from './_components/PageContent';
import { Pager } from './_components/Pager';

type PageParams = {
  params: {
    id: string;
  };
};

export default async function Post({ params: { id } }: PageParams) {
  const post = await getPostById(id);

  if (!post) {
    return notFound();
  }

  const { prev, next } = await getAdjacentPosts(id);

  return (
    <>
      <PageContent
        frontmatter={post.frontmatter}
        content={post.content}
      />
      <Pager
        prev={prev!}
        next={next!}
      />
    </>
  );
}

export async function generateStaticParams() {
  const posts = await getAllPost();

  return posts.map((post) => ({
    id: post!.id
  }));
}

export async function generateMetadata({ params: { id } }: PageParams) {
  const post = await getPostById(id);

  if (!post) {
    return {
      title: 'Post Not Found'
    };
  }

  return {
    title: post.frontmatter.title
  };
}
