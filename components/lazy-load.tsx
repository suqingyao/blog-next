import { useInView } from '@/hooks/use-in-view';

type LazyLoadProps = {
  placeholder?: React.ReactNode;
  children?: React.ReactNode;
};

export const LazyLoad = ({ children, placeholder }: LazyLoadProps) => {
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
