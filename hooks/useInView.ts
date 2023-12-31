import { useState, useRef, useEffect } from 'react';

export interface Options extends IntersectionObserverInit {
  triggerOnce?: boolean;
}

const defaultOptions: Options = {
  root: null,
  rootMargin: '0px',
  threshold: 0,
  triggerOnce: false
};

export default function useInView(options = defaultOptions) {
  const { triggerOnce = false } = options;
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);

      if (entry.isIntersecting && triggerOnce && observer.current) {
        observer.current.disconnect();
      }
    }, options);
  }, [options, triggerOnce]);

  useEffect(() => {
    const currentRef = ref;
    const currentObserver = observer.current;

    if (currentRef && currentObserver) {
      currentObserver.observe(currentRef);
    }

    return () => {
      if (currentRef && currentObserver) {
        currentObserver.unobserve(currentRef);
      }
    };
  }, [ref]);

  return [setRef, inView] as const;
}
