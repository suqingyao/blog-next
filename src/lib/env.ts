import { IS_PROD } from './constants';

export const OUR_DOMAIN =
  process.env.NEXT_PUBLIC_OUR_DOMAIN ||
  process.env.NEXT_PUBLIC_VERCEL_URL ||
  'localhost:2323';
export const SITE_URL = `${IS_PROD ? 'https' : 'http'}://${OUR_DOMAIN}`;
