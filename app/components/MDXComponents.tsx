import CopyButton from './CopyButton';
import DarkToggle from './DarkToggle';

const components = {
  nav: (props: any) => <nav className="fixed right-0 top-0" {...props} />,
  DarkToggle: (props: any) => <DarkToggle {...props} />,
  pre: (props: any) => (
    <pre className="relative" {...props}>
      {/* <CopyButton /> */}
      {props.children}
    </pre>
  )
  // code: (props: any) => <code className="flex flex-col" {...props} />
};

export default components;
