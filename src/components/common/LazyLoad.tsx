import { useInView } from '@/hooks/use-in-view';

interface LazyLoadProps {
  placeholder?: React.ReactNode;
  children?: React.ReactNode;
}

export function LazyLoad({ children, placeholder }: LazyLoadProps) {
  const [targetRef, isInView] = useInView({
    triggerOnce: true,
  });

  return (
    <>
      <div ref={targetRef}></div>
      {isInView ? <>{children}</> : <>{placeholder}</>}
    </>
  );
}
