import { PropsWithChildren } from 'react';

export const DarkModeOnly = (props: PropsWithChildren) => {
  return <div className="hidden dark:contents">{props.children}</div>;
};
