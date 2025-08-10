import { notFound } from 'next/navigation';
import PostMeta from '@/components/site/PostMeta';
import PostTitle from '@/components/site/PostTitle';
import { MarkdownContentServer } from '@/components/ui/markdown';
import { getAllPosts, getPostBySlug } from '@/models/post.model';

interface PostPageParams {
  params: {
    slug: string;
  };
}

async function PostPage({ params }: PostPageParams) {
  const { slug } = await params;
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
          dark: 'vitesse-black',
        }}
        withToc
      >
      </MarkdownContentServer>
    </div>
  );
}

export async function generateStaticParams() {
  const posts = await getAllPosts();

  return posts.map(post => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PostPageParams) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
  };
}

export default PostPage;
