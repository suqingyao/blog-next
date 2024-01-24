import { CodeBlock } from './mdx/code-block';
import { Sidebar } from './mdx/sidebar';

import { DarkToggle } from './dark-toggle';
import { LinkCard } from './link-card';
import { LazyImage } from './lazy-image';

const components = {
  nav: (props: any) => <Sidebar {...props} />,
  DarkToggle,
  LinkCard,
  pre: (props: any) => <CodeBlock {...props} />,
  img: (props: any) => <LazyImage {...props} />
};

export default components;
