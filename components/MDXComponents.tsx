import { cn } from '@/lib/utils';
import DarkToggle from './DarkToggle';
import TOC from './TOC';
import Pre from './mdx/Pre';
import Code from './mdx/Code';

const components = {
  // nav: (props: any) => (
  //   <TOC {...props}>
  //     <nav className="fixed" />
  //   </TOC>
  // ),
  DarkToggle,
  pre: (props: any) => <Pre {...props} />,
  code: (props: any) => <Code {...props} />
};

export default components;
