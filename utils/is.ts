export const isBrowser = ![typeof window, typeof document].includes(
  'undefined'
);

export const isClient = typeof window !== 'undefined';

export const isDev = process.env.NODE_ENV === 'development';

export const isArrayLike = (value: any): value is ArrayLike<any> =>
  Array.isArray(value) ||
  (value && typeof value === 'object' && typeof value.length === 'number');
