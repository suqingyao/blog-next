export const isBrowser = ![typeof window, typeof document].includes(
  'undefined'
);

export const isClient = typeof window !== 'undefined';
