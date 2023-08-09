import DarkToggle from './DarkToggle';

const components = {
  nav: (props: any) => <nav className="fixed right-0 top-0" {...props} />,
  DarkToggle: (props: any) => <DarkToggle {...props} />
};

export default components;
