import CodeBlock from './mdx/CodeBlock';
import Sidebar from './mdx/Sidebar';

import DarkToggle from './DarkToggle';
import LinkCard from './LinkCard';
import LazyImage from './LazyImage';

const components = {
  nav: (props: any) => <Sidebar {...props} />,
  DarkToggle,
  LinkCard,
  pre: (props: any) => <CodeBlock {...props} />,
  img: (props: any) => <LazyImage {...props} />
};

export default components;
