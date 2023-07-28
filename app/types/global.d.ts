type Fn = () => void;

interface Frontmatter {
  title: string;
  date: string;
  slug: string;
  description?: string;
  readingTime?: string;
}

interface Post {
  content: JSX;
  frontmatter: Frontmatter;
}
