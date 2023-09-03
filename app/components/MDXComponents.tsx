import CopyButton from './CopyButton';
import DarkToggle from './DarkToggle';
import TOC from './TOC';

const components = {
  // nav: (props: any) => (
  //   <TOC {...props}>
  //     <nav className="fixed" />
  //   </TOC>
  // ),
  DarkToggle,
  pre: (props: any) => (
    <pre className="relative" {...props}>
      {/* <CopyButton /> */}
      {props.children}
    </pre>
  )
  // code: (props: any) => <code className="flex flex-col" {...props} />
};

export default components;
