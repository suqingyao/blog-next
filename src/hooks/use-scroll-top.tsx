import { useAtomValue } from 'jotai';
import { useCallback, useEffect, useState } from 'react';
import { scrollContainerRefAtom } from '@/store/atoms/app';

export function useScrollTop() {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollContainerRef = useAtomValue(scrollContainerRefAtom);

  const handleScroll = useCallback(() => {
    // Try to find our custom scroll container first
    const scrollTop = scrollContainerRef ? scrollContainerRef.scrollTop : window.pageYOffset;
    setScrollTop(scrollTop);
  }, [scrollContainerRef]);

  useEffect(() => {
    scrollContainerRef?.addEventListener('scroll', handleScroll);
    return () => {
      scrollContainerRef?.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll, scrollContainerRef]);

  return scrollTop;
}
