import { useInView } from 'framer-motion';
import { useRef } from 'react';

import type { FC, PropsWithChildren } from 'react';

interface LazyLoadProps extends PropsWithChildren {
  placeholder?: React.ReactNode;
}

const LazyLoad: FC<LazyLoadProps> = ({ children, placeholder }) => {
  const ref = useRef<HTMLSpanElement | null>(null);

  const isInView = useInView(ref, {
    once: true
  });

  return (
    <>
      <span
        ref={ref}
        className="block"
      ></span>
      {isInView ? <>{children}</> : <>{placeholder}</>}
    </>
  );
};

export default LazyLoad;
