import DarkToggle from './DarkToggle';
import Pre from './mdx/Pre';
import Code from './mdx/Code';
import LinkCard from './LinkCard';

const components = {
  // nav: (props: any) => (
  //   <TOC {...props}>
  //     <nav className="fixed" />
  //   </TOC>
  // ),
  DarkToggle,
  LinkCard,
  pre: (props: any) => <Pre {...props} />
  // code: (props: any) => <Code {...props} />
};

export default components;
