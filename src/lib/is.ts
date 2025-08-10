const toString = Object.prototype.toString;

export const isBrowser = ![typeof window, typeof document].includes(
  'undefined',
);

export function isArrayLike(value: any): value is ArrayLike<any> {
  return Array.isArray(value)
    || (value && typeof value === 'object' && typeof value.length === 'number');
}

export const isWindow = (el: any): el is Window => el === window;

export const isServer = () => typeof window === 'undefined';

export const isBoolean = (value: any) => typeof value === 'boolean';

export const isUndefined = (value: any) => value === undefined;

export const isDefined = (value: any) => value !== undefined && value !== null;

export const isString = (value: any) => typeof value === 'string';

export const isNumber = (value: any) => !Number.isNaN(value);

export const isArray = (value: any) => Array.isArray(value);

export const isFunction = (value: any) => typeof value === 'function';

export function isPlainObject(value: any) {
  return toString.call(value) === '[object Object]';
}

export const isObject = (value: any) => typeof value === 'object';

export function isEmpty(value: any) {
  if (isUndefined(value)) {
    return true;
  }

  if (isNumber(value)) {
    return false;
  }

  if (isBoolean(value)) {
    return false;
  }

  if (isArray(value) || isString(value) || isArrayLike(value)) {
    return value.length === 0;
  }

  if (isPlainObject(value)) {
    return Object.keys(value).length === 0;
  }

  return false;
}
