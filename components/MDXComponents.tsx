import DarkToggle from './DarkToggle';
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
