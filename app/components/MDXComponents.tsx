import clsx from 'clsx';

const titleBaseStyle = clsx(
  `relative font-bold before:absolute before:-left-[1em] before:opacity-0 before:content-['#'] hover:before:opacity-100 hover:before:transition-opacity`
);

const components = {
  h1: (props: any) => (
    <h1
      className={clsx(titleBaseStyle, 'm-0 hidden p-0 text-2xl')}
      {...props}
    />
  ),
  h2: (props: any) => (
    <h2 className={clsx(titleBaseStyle, 'text-xl')} {...props} />
  ),
  h3: (props: any) => (
    <h3 className={clsx(titleBaseStyle, 'text-lg')} {...props} />
  ),
  h4: (props: any) => (
    <h4 className={clsx(titleBaseStyle, 'text-base')} {...props} />
  ),
  h5: (props: any) => (
    <h5 className={clsx(titleBaseStyle, 'text-sm')} {...props} />
  ),
  h6: (props: any) => (
    <h6 className={(clsx(titleBaseStyle), 'text-xs')} {...props} />
  ),
  li: (props: any) => <li className="text-primary" {...props} />,
  pre: (props: any) => (
    <pre
      className="my-3 rounded-md bg-[#f8f8f8] px-3 py-2 dark:bg-[#0e0e0e]"
      {...props}
    />
  ),
  code: (props: any) => <code {...props} />
  // nav: (props: any) => <nav className="fixed !left-0 top-0" {...props} />
};

export default components;
