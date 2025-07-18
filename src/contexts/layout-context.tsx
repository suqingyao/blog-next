'use client';

import { type ClassValue } from 'clsx';
import { useEventListener } from '@/hooks/use-event-listener';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState
} from 'react';

interface LayoutContextProps {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
  mainContainerClassName: ClassValue | ClassValue[];
  setMainContainerClassName: Dispatch<
    SetStateAction<ClassValue | ClassValue[]>
  >;
}

export const LayoutContext = createContext<LayoutContextProps>({
  isMobile: false,
  isTablet: false,
  isDesktop: false,
  screenWidth: 0,
  mainContainerClassName: 'w-[75ch]',
  setMainContainerClassName: () => {}
});

export const LayoutContextProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);
  const [mainContainerClassName, setMainContainerClassName] = useState<
    ClassValue | ClassValue[]
  >('w-[75ch]');

  useEventListener('resize', () => {
    setScreenWidth(window.innerWidth);
    setIsMobile(window.innerWidth < 768);
    setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    setIsDesktop(window.innerWidth >= 1024);
  });

  return (
    <LayoutContext.Provider
      value={{
        isMobile,
        isTablet,
        isDesktop,
        screenWidth,
        mainContainerClassName,
        setMainContainerClassName
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayoutContext = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error(
      'useLayoutContext must be used within a LayoutContextProvider'
    );
  }
  return context;
};
