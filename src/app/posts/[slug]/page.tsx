import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug } from '@/models/post.model';
import MarkdownContentServer from '@/components/common/markdown-content-server';
import PostTitle from '@/components/site/post-title';
import PostMeta from '@/components/site/post-meta';
import { IS_PROD } from '@/lib/constants';

type PostPageParams = {
  params: {
    slug: string;
  };
};

// 生产环境自动缓存，开发环境强制动态
export const dynamic = IS_PROD ? 'auto' : 'force-dynamic';

const PostPage = async ({ params: { slug } }: PostPageParams) => {
  const post = await getPostBySlug(slug);

  if (!post) {
    return notFound();
  }

  // const { prev, next } = await getAdjacentPosts(slug);

  return (
    <div className="mx-auto w-[75ch] font-sans">
      <PostTitle
        post={post as Post}
        center={true}
      />

      <PostMeta post={post} />

      <MarkdownContentServer
        className="mt-10"
        content={post?.code}
        codeTheme={{
          light: 'vitesse-light',
          dark: 'vitesse-black'
        }}
        withToc
      ></MarkdownContentServer>
    </div>
  );
};

export async function generateStaticParams() {
  const posts = await getAllPosts();

  return posts.map((post) => ({
    slug: post.slug
  }));
}

export async function generateMetadata({ params: { slug } }: PostPageParams) {
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found'
    };
  }

  return {
    title: post.title
  };
}

export default PostPage;
