import {
  getAdjacentPosts,
  getAllPostFrontMatter,
  getPostBySlug
} from '@/app/utils/mdx';

import { AiOutlineFieldTime } from 'react-icons/ai';
import Pager from './components/Pager';
import dayjs from 'dayjs';

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
      <h1 className="text-center text-2xl font-bold">{frontmatter.title}</h1>
      <p className="flex flex-row gap-2">
        <span>{dayjs(frontmatter.date).format('MMM d, YYYY')}</span>
        <span className="flex flex-row items-center">
          <AiOutlineFieldTime size={20} className="inline-block" />
          {frontmatter.readingTime}
        </span>
      </p>
      <article
        className="
          prose
          transition-opacity
          dark:prose-invert
          before:transition-opacity
          prose-headings:opacity-50
          hover:prose-headings:opacity-100
          prose-h1:hidden
          prose-h2:relative
          prose-h2:before:absolute
          prose-h2:before:-left-[1em]
          prose-h2:before:opacity-0
          prose-h2:before:content-['#']
          hover:prose-h2:before:opacity-100
          prose-pre:bg-[#f8f8f8]
          dark:prose-pre:bg-[#0e0e0e]
        "
      >
        {content}
      </article>
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
