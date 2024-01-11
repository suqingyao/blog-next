import { notFound } from 'next/navigation';

import {
  getAdjacentPosts,
  getAllPostFrontMatter,
  getPostBySlug
} from '@/utils/mdx';

import { PageContent } from './_components/PageContent';
import { Pager } from './_components/Pager';

type PageParams = {
  params: {
    slug: string;
  };
};

export default async function Post({ params: { slug } }: PageParams) {
  const post = await getPostBySlug(slug);
  if (!post) {
    return notFound();
  }

  const { prev, next } = await getAdjacentPosts(slug);

  return (
    <>
      <PageContent
        frontmatter={post.frontmatter}
        content={post.content}
      />
      <Pager
        prev={prev}
        next={next}
      />
    </>
  );
}

export async function generateStaticParams() {
  const posts = await getAllPostFrontMatter();

  return posts.map((post) => ({
    slug: post.slug
  }));
}

export async function generateMetadata({ params: { slug } }: PageParams) {
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found'
    };
  }

  return {
    title: post.frontmatter.title
  };
}
