import DarkToggle from './DarkToggle';
import CodeBlock from './mdx/CodeBlock';
import LinkCard from './LinkCard';

const components = {
  // nav: (props: any) => (
  //   <TOC {...props}>
  //     <nav className="fixed" />
  //   </TOC>
  // ),
  DarkToggle,
  LinkCard,
  pre: (props: any) => <CodeBlock {...props} />
};

export default components;
