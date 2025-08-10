import type { DetailedHTMLProps, FC, HTMLAttributes } from 'react';
import * as React from 'react';

import { cn } from '@/lib/utils';

export const Divider: FC<
  DetailedHTMLProps<HTMLAttributes<HTMLHRElement>, HTMLHRElement>
> = (props) => {
  const { className, ...rest } = props;
  return (
    <hr
      className={cn(
        '!bg-opacity-30 my-4 h-[0.5px] border-0 bg-black dark:bg-white',
        className,
      )}
      {...rest}
    />
  );
};

export const DividerVertical: FC<
  DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>
> = (props) => {
  const { className, ...rest } = props;
  return (
    <span
      className={cn(
        '!bg-opacity-30 mx-4 inline-block h-full w-[0.5px] bg-black text-transparent select-none dark:bg-white',
        className,
      )}
      {...rest}
    >
      w
    </span>
  );
};

export const BreadcrumbDivider: FC<{ className?: string }> = ({
  className,
}) => {
  return (
    <svg
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      color="currentColor"
      shapeRendering="geometricPrecision"
      viewBox="0 0 24 24"
      className={className}
    >
      <path d="M16.88 3.549L7.12 20.451" />
    </svg>
  );
};
