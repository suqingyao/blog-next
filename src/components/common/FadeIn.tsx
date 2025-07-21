'use client';

import { useInView } from '@/hooks/use-in-view';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

export const FadeIn = ({
  children,
  className,
  ...props
}: {
  children?: JSX.Element | JSX.Element[];
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const [targetRef, isInView] = useInView({
    root: null,
    rootMargin: '0px',
    threshold: 0,
    triggerOnce: false
  });

  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (!locked && isInView === true) {
      setLocked(true);
    }
  }, [isInView]);

  return (
    <span
      ref={targetRef}
      className={cn(
        'block transition-[opacity,transform] duration-800 ease-in-out',
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
