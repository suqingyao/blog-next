type Fn = () => void;

interface Post {
  path: string;
  slug: string;
  frontmatter: PostFrontmatter;
}
