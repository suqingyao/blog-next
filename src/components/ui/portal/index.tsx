'use client';

import type { FC, PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';

import { useRootPortal } from './provider';

export const RootPortal: FC<
  {
    to?: HTMLElement;
  } & PropsWithChildren
> = (props) => {
  const to = useRootPortal();

  // SSR safe: only render portal on client side
  const target = props.to || to || (typeof document !== 'undefined' ? document.body : null);
  
  if (!target) {
    return null; // Don't render during SSR if no target
  }

  return createPortal(props.children, target);
};
export { RootPortalProvider } from './provider';
