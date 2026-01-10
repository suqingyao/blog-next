import process from 'node:process';

export const isDevelopment = process.env.NODE_ENV === 'development';

export const isProduction = process.env.NODE_ENV === 'production';

export const isClient = typeof window !== 'undefined' || typeof document !== 'undefined';

export const isServer = !isClient;
