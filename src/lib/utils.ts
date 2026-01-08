import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Tremor Raw focusInput [v0.0.1]

export const focusInput = [
  // base
  'focus:ring-2',
  // ring color
  'focus:ring-blue-200 focus:dark:ring-blue-700/30',
  // border color
  'focus:border-blue-500 focus:dark:border-blue-700',
];

// Tremor Raw focusRing [v0.0.1]

export const focusRing = [
  // base
  'outline outline-offset-2 outline-0 focus-visible:outline-2',
  // outline color
  'outline-blue-500 dark:outline-blue-500',
];

// Tremor Raw hasErrorInput [v0.0.1]

export const hasErrorInput = [
  // base
  'ring-2',
  // border color
  'border-red-500 dark:border-red-700',
  // ring color
  'ring-red-200 dark:ring-red-700/30',
];

/** 空操作函数 */
export function NOOP() {}
/**
 * 滚动到页面中的指定元素
 * @param hash 目标元素的 hash 值（包含 #）
 * @param notUserContent 是否为非用户内容，默认为 false
 * @param offsetTop 滚动偏移量，默认为 20px
 */
export function scrollToElement(hash: string, notUserContent: boolean = false, offsetTop: number = 20) {
  const calculateElementTop = (el: HTMLElement) => {
    let top = 0;
    while (el) {
      top += el.offsetTop;
      el = el.offsetParent as HTMLElement;
    }
    return top;
  };

  const _hash = decodeURIComponent(hash.slice(1));
  if (!_hash)
    return;
  if (history.state?.preventScrollToToc) {
    history.state.preventScrollToToc = false;
    return;
  }
  const targetElement = document.querySelector(
    notUserContent
      ? `#${decodeURIComponent(_hash)}`
      : `#user-content-${decodeURIComponent(_hash)}`,
  ) as HTMLElement;
  if (!targetElement)
    return;

  window.scrollTo({
    top: calculateElementTop(targetElement) - offsetTop,
    behavior: 'smooth',
  });
}

/**
 * 获取请求参数
 * @param req 请求对象
 * @returns 参数对象
 */
export function getQuery(req: Request) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;
  const obj: Record<string, string | string[]> = {};

  for (const [key, value] of Array.from(searchParams.entries())) {
    if (key in obj) {
      if (Array.isArray(obj[key])) {
        (obj[key] as string[]).push(value);
      }
      else {
        obj[key] = [obj[key] as string, value];
      }
    }
    else {
      obj[key] = value;
    }
  }

  return obj;
}
