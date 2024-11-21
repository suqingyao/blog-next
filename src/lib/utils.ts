import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const scrollTo = (hash: string, notUserContent?: boolean) => {
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
    top: calculateElementTop(targetElement) - 20,
    behavior: 'smooth'
  });
};

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
