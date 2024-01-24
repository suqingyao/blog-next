import type { FC, PropsWithChildren } from 'react';

import { useInView } from '@/hooks/use-in-view';

type LazyLoadProps = PropsWithChildren & {
  placeholder?: React.ReactNode;
};

export const LazyLoad: FC<LazyLoadProps> = ({ children, placeholder }) => {
  const [targetRef, isInView] = useInView({
    triggerOnce: true
  });

  return (
    <>
      <span
        ref={targetRef}
        className="block"
      ></span>
      {isInView ? <>{children}</> : <>{placeholder}</>}
    </>
  );
};
