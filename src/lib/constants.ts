export const NOOP = () => {};

export const IS_BROWSER = typeof document !== 'undefined';

export const IS_PROD = IS_BROWSER
  ? !location.hostname.endsWith('localhost')
  : process.env.NODE_ENV === 'production';
export const IS_DEV = process.env.NODE_ENV === 'development';

export const RESERVED_TAGS = ['page', 'post', 'portfolio', 'comment', 'short'];
