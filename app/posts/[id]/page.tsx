import { notFound } from 'next/navigation';

import { getAdjacentPosts, getAllPost, getPostById } from '@/utils/mdx';

import { PageContent } from './_components/page-content';
import { Pagination } from './_components/pagination';

type PostPageParams = {
  params: {
    id: string;
  };
};

const PostPage = async ({ params: { id } }: PostPageParams) => {
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
      <Pagination
        prev={prev!}
        next={next!}
      />
    </>
  );
};

export async function generateStaticParams() {
  const posts = await getAllPost();

  return posts.map((post) => ({
    id: post!.id
  }));
}

export async function generateMetadata({ params: { id } }: PostPageParams) {
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

export default PostPage;
