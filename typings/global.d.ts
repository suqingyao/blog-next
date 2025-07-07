import type { JSX as Jsx } from 'react/jsx-runtime';

declare global {
  namespace JSX {
    type ElementClass = Jsx.ElementClass;
    type Element = Jsx.Element;
    type IntrinsicElements = Jsx.IntrinsicElements;
  }

  type Fn = () => void;

  interface Post {
    slug: string;
    code: string;
    id: string;
    title: string;
    createdTime: string | Date;
    published: boolean;
    cover?: string;
    description?: string;
    readingTime?: string;
    tags?: string[];
  }
}
