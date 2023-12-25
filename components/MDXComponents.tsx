import DarkToggle from './DarkToggle';
import Pre from './mdx/Pre';
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
};

export default components;
