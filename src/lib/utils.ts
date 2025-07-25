import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 滚动到指定位置
 * @param hash 锚点 hash
 * @param notUserContent 是否不使用 user-content 前缀，默认使用
 * @returns 无返回值
 */
export const scrollTo = (
  hash: string,
  notUserContent: boolean = false,
  offsetTop: number = 20
) => {
  const calculateElementTop = (el: HTMLElement) => {
    let top = 0;
    while (el) {
      top += el.offsetTop;
      el = el.offsetParent as HTMLElement;
    }
    return top;
  };

  const _hash = decodeURIComponent(hash.slice(1));
  if (!_hash) return;
  if (history.state?.preventScrollToToc) {
    history.state.preventScrollToToc = false;
    return;
  }
  const targetElement = document.querySelector(
    notUserContent
      ? `#${decodeURIComponent(_hash)}`
      : `#user-content-${decodeURIComponent(_hash)}`
  ) as HTMLElement;
  if (!targetElement) return;

  window.scrollTo({
    top: calculateElementTop(targetElement) - offsetTop,
    behavior: 'smooth'
  });
};

/**
 * 获取请求参数
 * @param req 请求对象
 * @returns 参数对象
 */
export const getQuery = (req: Request) => {
  const url = new URL(req.url);
  const searchParams = url.searchParams;
  const obj: Record<string, string | string[]> = {};

  for (const [key, value] of Array.from(searchParams.entries())) {
    if (key in obj) {
      if (Array.isArray(obj[key])) {
        (obj[key] as string[]).push(value);
      } else {
        obj[key] = [obj[key] as string, value];
      }
    } else {
      obj[key] = value;
    }
  }

  return obj;
};
