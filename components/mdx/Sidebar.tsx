'use client';

import { useMount } from '@/hooks/useMount';
import { useRef, type FC, type PropsWithChildren, ReactNode } from 'react';

export interface SidebarProps extends PropsWithChildren {}

type Children = {
  type?: string;
  key?: string | null;
  ref?: HTMLElement | null;
  props?: {
    children?: Children[];
    className?: string;
  };
};

function getChildren(children: Children) {
  if (children.props?.children?.length) {
    Array.from(children.props.children).forEach((child) => {
      return getChildren(child);
    });
  } else {
    return children;
  }
}

const Sidebar: FC<SidebarProps> = ({ children, ...restProps }) => {
  const listRef = useRef<Children[]>([]);

  const components = children as Children;

  useMount(() => {
    if (components.type === 'li') {
      listRef.current.push(components);
    }
    if (components.props?.children?.length) {
      Array.from(components.props.children).forEach((child) => {
        const node = getChildren(child);
        if (node?.type === 'li') {
          listRef.current.push(node);
        }
      });
    }
    console.log(
      '🚀 ~ file: Sidebar.tsx:15 ~ listRef.current:',
      listRef.current
    );
  });

  return <nav {...restProps}>{children}</nav>;
};

export default Sidebar;
