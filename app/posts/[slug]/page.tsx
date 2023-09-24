import {
  getAdjacentPosts,
  getAllPostFrontMatter,
  getPostBySlug
} from '@/app/utils/mdx';

import { AiOutlineFieldTime } from 'react-icons/ai';
import Pager from './components/Pager';
import dayjs from 'dayjs';
import Article from './components/Article';

interface PageParams {
  params: {
    slug: string;
  };
}

export default async function Post({ params: { slug } }: PageParams) {
  const { content, frontmatter } = await getPostBySlug(slug);

  const { prev, next } = await getAdjacentPosts(slug);

  return (
    <>
      <h1 className="mx-auto w-[32rem] text-center text-2xl font-bold">
        {frontmatter.title}
      </h1>
      <p className="flex flex-row gap-2">
        <span>{dayjs(frontmatter.date).format('MMM DD, YYYY')}</span>
        <span className="flex flex-row items-center">
          <AiOutlineFieldTime size={20} className="inline-block" />
          {frontmatter.readingTime}
        </span>
      </p>
      <Article>{content}</Article>
      <Pager prev={prev!} next={next!} />
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
