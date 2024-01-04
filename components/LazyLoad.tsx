import type { FC, PropsWithChildren } from 'react';

import useInView from '@/hooks/useInView';

type LazyLoadProps = PropsWithChildren & {
  placeholder?: React.ReactNode;
};

const LazyLoad: FC<LazyLoadProps> = ({ children, placeholder }) => {
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

export default LazyLoad;
