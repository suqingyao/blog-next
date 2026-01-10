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
  // SSR safe: store initial title in ref, but only access in useEffect
  const prevTitleRef = useRef<string>('');

  useEffect(() => {
    // Store the initial title on first mount
    if (!prevTitleRef.current && typeof document !== 'undefined') {
      prevTitleRef.current = document.title;
    }

    if (typeof document === 'undefined')
      return;

    // Update title
    const newTitle = titleTemplate.replace('%s', title);
    if (document.title !== newTitle) {
      document.title = newTitle;
    }

    // Restore on unmount if needed
    if (options.restoreOnUnmount) {
      return () => {
        if (typeof document !== 'undefined') {
          document.title = prevTitleRef.current;
        }
      };
    }
  }, [title, options.restoreOnUnmount]);
}

export const useTitle = typeof document !== 'undefined' ? useTitlePrimitive : (_title: string) => {};
