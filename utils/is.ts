export const isBrowser = ![typeof window, typeof document].includes(
  'undefined'
);

export const isClient = typeof window !== 'undefined';

export const isDev = process.env.NODE_ENV === 'development';
