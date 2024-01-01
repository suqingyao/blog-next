import { useEffect, useState } from 'react';

export enum ScrollDirection {
  Up = 'up',
  Down = 'down'
}

const useScrollDirection = (): ScrollDirection => {
  const [scrollDir, setScrollDir] = useState<ScrollDirection>(
    ScrollDirection.Up
  );

  useEffect(() => {
    let lastScrollY = window.pageYOffset;
    const updateScrollDir = () => {
      const scrollY = window.pageYOffset;

      // Scrolling down
      if (scrollY > lastScrollY) {
        setScrollDir(ScrollDirection.Down);
      }
      // Scrolling up
      else if (scrollY < lastScrollY) {
        setScrollDir(ScrollDirection.Up);
      }
      // set lastScrollY for the next comparison
      lastScrollY = scrollY > 0 ? scrollY : 0;
    };

    window.addEventListener('scroll', updateScrollDir);

    return () => window.removeEventListener('scroll', updateScrollDir);
  }, []);

  return scrollDir;
};

export default useScrollDirection;
