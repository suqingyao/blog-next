import { useEffect, useRef } from 'react';
import { APP_NAME } from '@/constants';

export interface UseTitleOptions {
  restoreOnUnmount?: boolean;
}

const DEFAULT_USE_TITLE_OPTIONS: UseTitleOptions = {
  restoreOnUnmount: false,
};

const titleTemplate = `%s | ${APP_NAME}`;
function useTitlePrimitive(title: string, options: UseTitleOptions = DEFAULT_USE_TITLE_OPTIONS) {
  const prevTitleRef = useRef(document.title);

  if (document.title !== title)
    document.title = title;

  useEffect(() => {
    if (options.restoreOnUnmount) {
      document.title = titleTemplate.replace('%s', title);
      return () => {
        document.title = prevTitleRef.current;
      };
    }
  }, []);
}

export const useTitle = typeof document !== 'undefined' ? useTitlePrimitive : (_title: string) => {};
