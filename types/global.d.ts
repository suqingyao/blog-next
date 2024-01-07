type Fn = () => void;

interface Frontmatter {
  title: string;
  date: string | Date;
  slug: string;
  description?: string;
  readingTime?: string;
  draft?: boolean;
  prev?: Frontmatter;
  next?: Frontmatter;
}

interface Post {
  content: ReactElement<any, string | JSXElementConstructor<any>>;
  frontmatter: Frontmatter;
}
