import { getAllPostFrontMatter, getPostBySlug } from '@/app/utils/mdx';
import { AiOutlineFieldTime } from 'react-icons/ai';
import PostWrapper from '@/app/components/PostWrapper';

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
        {/* <span>{format(new Date(frontmatter.date), 'yyyy-MM-dd')}</span> */}
        <span className="flex flex-row items-center">
          <AiOutlineFieldTime size={20} className="inline-block" />
          {frontmatter.readingTime}
        </span>
      </p>

      <PostWrapper>{content}</PostWrapper>
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
