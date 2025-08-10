import type { PropsWithChildren } from 'react';

export function DarkModeOnly(props: PropsWithChildren) {
  return <div className="hidden dark:contents">{props.children}</div>;
}
