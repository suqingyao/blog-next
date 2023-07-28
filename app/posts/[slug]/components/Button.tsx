import React, { ReactNode } from 'react';
import clsx from 'clsx';

export default function Button({
  children,
  onClick,
  className
}: {
  children?: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      className={clsx(`rounded-md border border-gray-200 px-3 py-2`, className)}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
