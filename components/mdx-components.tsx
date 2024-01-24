import { CodeBlock } from './mdx/code-block';
import { TableOfContents } from './mdx/table-of-contents';

import { DarkToggle } from './dark-toggle';
import { LinkCard } from './link-card';
import { LazyImage } from './lazy-image';

const components = {
  nav: (props: any) => <TableOfContents {...props} />,
  DarkToggle,
  LinkCard,
  pre: (props: any) => <CodeBlock {...props} />,
  img: (props: any) => <LazyImage {...props} />
};

export default components;
