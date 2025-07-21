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
      <div ref={targetRef}></div>
      {isInView ? <>{children}</> : <>{placeholder}</>}
    </>
  );
};
