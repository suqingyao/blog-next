import Link from 'next/link';

interface PostListProps {
  posts: Frontmatter[];
}

export default function PostList({ posts }: PostListProps) {
  return (
    <div>
      {posts.map((post) => (
        <Link href={`/posts/${post.slug}`} key={post.slug} className="block">
          {post.title}
        </Link>
      ))}
    </div>
  );
}
