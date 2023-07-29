const components = {
  h1: (props: any) => <></>,
  h2: (props: any) => <h2 className="text-xl font-bold" {...props} />,
  h3: (props: any) => <h3 className="text-lg font-bold" {...props} />,
  h4: (props: any) => <h4 className="text-base font-bold" {...props} />,
  h5: (props: any) => <h5 className="text-sm font-bold" {...props} />,
  h6: (props: any) => <h6 className="text-xs font-bold" {...props} />,
  li: (props: any) => <li className="text-primary" {...props} />
  // pre: (props: any) => <div className="my-3" {...props} />
};

export default components;
