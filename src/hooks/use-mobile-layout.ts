import { atom, useAtom, useAtomValue } from 'jotai';
import { useCallback, useEffect } from 'react';

const mobileWidth = 1024;

const isMobileAtom = atom<{
  isMobile: boolean | undefined;
}>({
  isMobile: undefined,
});

export function useMobileLayout() {
  const [isMobile, setIsMobile] = useAtom(isMobileAtom);

  const calc = useCallback(() => {
    setIsMobile({
      isMobile: window.innerWidth < mobileWidth,
    });
  }, []);

  useEffect(() => {
    window.addEventListener('resize', calc);
    return () => {
      window.removeEventListener('resize', calc);
    };
  }, [calc]);

  useEffect(() => {
    calc();
  }, []);
}

export const useIsMobileLayout = () => useAtomValue(isMobileAtom);
