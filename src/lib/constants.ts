export const NOOP = () => {};

export const IS_BROWSER = typeof document !== 'undefined';

export const IS_PROD = IS_BROWSER
  ? !location.hostname.endsWith('localhost')
  : process.env.NODE_ENV === 'production';
export const IS_DEV = process.env.NODE_ENV === 'development';

export const RESERVED_TAGS = ['page', 'post', 'portfolio', 'comment', 'short'];

export const OSS_URL_PREFIX = `https://${process.env
  .NEXT_PUBLIC_OSS_BUCKET!}.${process.env
  .NEXT_PUBLIC_OSS_REGION!}.aliyuncs.com`;
