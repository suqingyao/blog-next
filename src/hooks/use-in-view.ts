import { useState, useRef, useEffect, useCallback } from 'react';

export interface Options extends IntersectionObserverInit {
  triggerOnce?: boolean;
}

const defaultOptions: Options = {
  root: null,
  rootMargin: '0px',
  threshold: 0,
  triggerOnce: false
};

export const useInView = (options = defaultOptions) => {
  const { triggerOnce = false } = options;
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const hasTriggered = useRef(false);

  const setRef = useCallback((node: HTMLElement | null) => {
    if (ref.current === node) return;
    ref.current = node;
    setInView(false);
    hasTriggered.current = false;
  }, []);

  useEffect(() => {
    if (!ref.current) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        if (triggerOnce) {
          hasTriggered.current = true;
          observer.current && observer.current.disconnect();
        }
      } else {
        if (!triggerOnce) setInView(false);
      }
    }, options);

    if (ref.current) observer.current.observe(ref.current);

    return () => {
      observer.current && observer.current.disconnect();
    };
  }, [options, triggerOnce, setRef]);

  useEffect(() => {
    // 组件卸载时清理 observer
    return () => {
      observer.current && observer.current.disconnect();
    };
  }, []);

  return [setRef, inView] as const;
};
