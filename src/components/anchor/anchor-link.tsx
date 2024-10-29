'use client';

import React from 'react';
import AnchorContext from './context';
import type { Anchor } from './anchor';
import { cn } from '@/lib/utils';
import './style/anchor-link.css';

export interface AnchorLinkBaseProps {
  href: string;
  target?: string;
  title: React.ReactNode;
  className?: string;
  replace?: boolean;
}

export interface AnchorLinkProps extends AnchorLinkBaseProps {
  children?: React.ReactNode;
}

const AnchorLink = (props: AnchorLinkProps) => {
  const { href, title, children, className, target, replace } = props;

  const context = React.useContext<Anchor | undefined>(AnchorContext);

  const {
    registerLink,
    unregisterLink,
    scrollTo,
    onClick,
    activeLink,
    direction
  } = context ?? {};

  React.useEffect(() => {
    registerLink?.(href);
    return () => unregisterLink?.(href);
  }, [href, registerLink, unregisterLink]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    onClick?.(e, { title, href });
    scrollTo?.(href);
    if (replace) {
      e.preventDefault();
      window.location.replace(href);
    }
  };

  const active = activeLink === href;

  const wrapperClassName = cn('anchor-link', className, {
    'anchor-link-active': active
  });

  const titleClassName = cn('anchor-link-title', {
    'anchor-link-title-active': active
  });

  return (
    <div className={wrapperClassName}>
      <a
        className={titleClassName}
        href={href}
        title={typeof title === 'string' ? title : ''}
        target={target}
        onClick={handleClick}
      >
        {title}
      </a>
      {direction !== 'horizontal' ? children : null}
    </div>
  );
};

export default AnchorLink;
