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
    createdTime: string;
    published: boolean;
    cover?: string;
    readingTime?: string;
    tags?: string[];
  }

  interface Document {
    startViewTransition?: (callback: () => void) => {
      finished: Promise<void>;
      ready: Promise<void>;
      updateCallbackDone: Promise<void>;
    };
  }
}

declare module '*.json' {
  const value: unknown;
  export default value;
}
