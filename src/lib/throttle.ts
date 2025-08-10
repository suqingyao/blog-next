export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  wait = 300,
  immediate = false,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) {
        fn.apply(this, args);
      }
    };
    const shouldCallNow = immediate && !timeout;

    if (!timeout) {
      timeout = setTimeout(later, wait);
    }

    if (shouldCallNow) {
      fn.apply(this, args);
    }
  };
}
