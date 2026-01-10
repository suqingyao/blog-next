import process from 'node:process';

/** 判断是否在浏览器环境 */
export const IS_BROWSER = typeof document !== 'undefined';

/** 判断是否为生产环境 */
export const IS_PROD = IS_BROWSER
  ? !location.hostname.endsWith('localhost')
  : process.env.NODE_ENV === 'production';

/** 判断是否为开发环境 */
export const IS_DEV = process.env.NODE_ENV === 'development';
