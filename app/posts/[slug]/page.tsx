import { getAllPostFrontMatter, getPostBySlug } from '@/app/utils/mdx';
import { format } from 'date-fns';
import { AiOutlineFieldTime } from 'react-icons/ai';

interface PageParams {
  params: {
    slug: string;
  };
}

export default async function Post({ params: { slug } }: PageParams) {
  const { content, frontmatter } = await getPostBySlug(slug);

  return (
    <>
      <h1 className="text-center text-2xl font-bold">{frontmatter.title}</h1>
      <p className="flex flex-row gap-2">
        <span>{format(new Date(frontmatter.date), 'yyyy-MM-dd')}</span>
        <span className="flex flex-row items-center">
          <AiOutlineFieldTime size={20} className="inline-block" />
          {frontmatter.readingTime}
        </span>
      </p>
      <article
        className="
          prose
          dark:prose-invert
          prose-h1:hidden
          prose-a:no-underline 
          prose-pre:bg-[#f8f8f8]
          dark:prose-pre:bg-[#0e0e0e]
        "
      >
        {content}
      </article>
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
