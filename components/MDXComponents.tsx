import DarkToggle from './DarkToggle';
import Pre from './mdx/Pre';
import Code from './mdx/Code';

import FlexDemo from '@/examples/css-middle/FlexDemo';
import AbsoluteDemo from '@/examples/css-middle/AbsoluteDemo';
import InlineBlockDemo from '@/examples/css-middle/InlineBlockDemo';

const components = {
  // nav: (props: any) => (
  //   <TOC {...props}>
  //     <nav className="fixed" />
  //   </TOC>
  // ),
  DarkToggle,
  FlexDemo,
  AbsoluteDemo,
  InlineBlockDemo,
  pre: (props: any) => <Pre {...props} />,
  code: (props: any) => <Code {...props} />
};

export default components;
