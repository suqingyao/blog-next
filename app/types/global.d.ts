type Fn = () => void;

interface Post {
  path: string;
  slug: string;
  frontmatter: PostFrontmatter;
}

interface PostFrontmatter {
  title: string;
  description?: string;
  date: Date;
}
