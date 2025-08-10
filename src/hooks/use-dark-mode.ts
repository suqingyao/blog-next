import { useTheme } from 'next-themes';

export function useIsDark() {
  const { theme, systemTheme } = useTheme();
  return theme === 'dark' || (theme === 'system' && systemTheme === 'dark');
}
