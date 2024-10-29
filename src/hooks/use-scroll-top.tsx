import { useCallback, useEffect, useState } from 'react';

export const useScrollTop = () => {
  const [scrollTop, setScrollTop] = useState(0);

  const handleScroll = useCallback(() => {
    const scrollTop = window.pageYOffset;
    setScrollTop(scrollTop);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return scrollTop;
};
