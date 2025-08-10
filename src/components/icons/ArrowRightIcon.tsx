import type { IconProps } from '.';
import React from 'react';

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      {...props}
    >
      <path
        d="M13 7L18 12M18 12L13 17M18 12L6 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
