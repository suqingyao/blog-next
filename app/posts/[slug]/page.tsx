import {
  getAdjacentPosts,
  getAllPostFrontMatter,
  getPostBySlug
} from '@/app/utils/mdx';

import { AiOutlineFieldTime } from 'react-icons/ai';
import Pager from './components/Pager';
import dayjs from 'dayjs';
import Prose from './components/Prose';

interface PageParams {
  params: {
    slug: string;
  };
}

export default async function Post({ params: { slug } }: PageParams) {
  const { content, frontmatter } = await getPostBySlug(slug);

  const { prev, next } = await getAdjacentPosts(slug);

  return (
    <div className="flex-1 pt-20">
      <h1 className="my-3 w-[32rem] text-2xl font-bold">{frontmatter.title}</h1>
      <p className="flex flex-row gap-2 text-[#555]">
        <span>{dayjs(frontmatter.date).format('MMM DD, YYYY')}</span>
        <span className="flex flex-row items-center">
          <AiOutlineFieldTime size={20} className="inline-block" />
          {frontmatter.readingTime}
        </span>
      </p>
      <Prose>{content}</Prose>
      <Pager prev={prev!} next={next!} />
    </div>
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
