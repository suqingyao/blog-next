'use client';

import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';
import { useInView } from '@/hooks/use-in-view';

const FadeIn = ({
  children,
  className,
  ...props
}: {
  children?: JSX.Element | JSX.Element[];
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const [ref, isInView] = useInView();

  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (!locked && isInView === true) {
      setLocked(true);
    }
  }, [isInView]);

  return (
    <span
      ref={ref}
      className={cn(
        'duration-800 block transition-[opacity,transform] ease-in-out',
        isInView === false && !locked
          ? // @see https://www.debugbear.com/blog/opacity-animation-poor-lcp
            'translate-y-[20%] opacity-[0.00001]'
          : 'translate-y-0 opacity-100',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default FadeIn;
