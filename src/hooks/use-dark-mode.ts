import { useTheme } from 'next-themes';
import { useEffect } from 'react';

import { COLOR_SCHEME_DARK, COLOR_SCHEME_LIGHT, IS_DEV, OUR_DOMAIN } from '@/constants';

export function useDarkModeListener() {
  const { theme, systemTheme } = useTheme();
  useEffect(() => {
    if (theme === 'system') {
      // delete cookie
      document.cookie = IS_DEV
        ? `color_scheme=;`
        : `color_scheme=; Domain=.${OUR_DOMAIN}; Path=/; Secure; expires=Thu, 01 Jan 1970 00:00:00 GMT`;

      return;
    }
    const isDarkMode = theme === 'dark';
    const colorScheme = isDarkMode ? COLOR_SCHEME_DARK : COLOR_SCHEME_LIGHT;
    const date = new Date();
    date.setFullYear(date.getFullYear() + 10);
    document.cookie = IS_DEV
      ? `color_scheme=${colorScheme};`
      : `color_scheme=${colorScheme}; Domain=.${OUR_DOMAIN}; Path=/; expires=${date.toUTCString()}`;
  }, [theme, systemTheme]);
}

export function useIsDark() {
  const { theme, systemTheme } = useTheme();
  return theme === 'dark' || (theme === 'system' && systemTheme === 'dark');
}
