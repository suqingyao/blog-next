import { useEffect, useRef } from 'react';

import ResizeObserver from 'resize-observer-polyfill';
import { throttle } from '@/lib/throttle';
import { ResizeObserverProps } from './type';

const ResizeObserverComponent = (props: ResizeObserverProps) => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const onResize = (entries: ResizeObserverEntry[]) => {
    props.onResize?.(entries);
  };

  const resizeHandler = throttle(onResize);

  useEffect(() => {
    let firstExec = true;
    resizeObserverRef.current = new ResizeObserver((entries) => {
      if (firstExec) {
        firstExec = false;
        onResize?.(entries);
      }
      resizeHandler(entries);
    });

    resizeObserverRef.current?.observe(targetRef.current!);

    return () => {
      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = null;
    };
  }, []);

  return <div ref={targetRef}>{props.children}</div>;
};

export default ResizeObserverComponent;
