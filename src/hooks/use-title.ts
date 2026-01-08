import { useEffect, useRef } from 'react';
import { APP_NAME } from '@/constants';

const titleTemplate = `%s | ${APP_NAME}`;
export function useTitle(title?: Nullable<string>) {
  const currentTitleRef = useRef(document.title);
  useEffect(() => {
    if (!title)
      return;

    document.title = titleTemplate.replace('%s', title);
    return () => {
      document.title = currentTitleRef.current;
    };
  }, [title]);
}
