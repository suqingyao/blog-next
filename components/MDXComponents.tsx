import DarkToggle from './DarkToggle';
import CodeBlock from './mdx/CodeBlock';
import LinkCard from './LinkCard';
import LazyImage from './LazyImage';

const components = {
  // nav: (props: any) => (
  //   <TOC {...props}>
  //     <nav className="fixed" />
  //   </TOC>
  // ),
  DarkToggle,
  LinkCard,
  pre: (props: any) => <CodeBlock {...props} />,
  img: (props: any) => <LazyImage {...props} />
};

export default components;
