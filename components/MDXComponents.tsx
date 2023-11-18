import DarkToggle from './DarkToggle';
import Pre from './mdx/Pre';
import Code from './mdx/Code';

import FlexDemo from '@/examples/css-middle/FlexDemo';

const components = {
  // nav: (props: any) => (
  //   <TOC {...props}>
  //     <nav className="fixed" />
  //   </TOC>
  // ),
  DarkToggle,
  FlexDemo,
  pre: (props: any) => <Pre {...props} />,
  code: (props: any) => <Code {...props} />
};

export default components;
