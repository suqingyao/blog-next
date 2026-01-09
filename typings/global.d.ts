import type { FC, PropsWithChildren } from 'react';
import type { JSX as Jsx } from 'react/jsx-runtime';

declare global {
  namespace JSX {
    type ElementClass = Jsx.ElementClass;
    type Element = Jsx.Element;
    type IntrinsicElements = Jsx.IntrinsicElements;
  }

  export type Nullable<T> = T | null | undefined;

  type NilValue = null | undefined | false | '';

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

declare global {

  export type Component<P = object> = FC<Prettify<ComponentType & P>>;

  export type ComponentWithRef<P = object, Ref = object> = FC<ComponentWithRefType<P, Ref>>;
  export type ComponentWithRefType<P = object, Ref = object> = Prettify<
    ComponentType<P> & {
      ref?: React.Ref<Ref>;
    }
  >;

  export type ComponentType<P = object> = {
    className?: string;
  } & PropsWithChildren
  & P;
}

declare module '*.json' {
  const value: unknown;
  export default value;
}
