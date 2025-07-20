import { easeInOutCubic } from './easings';
import getScroll, { isWindow } from './getScroll';
import { raf } from './raf';

interface ScrollToOptions {
  /** Scroll container, default as window */
  getContainer?: () => HTMLElement | Window | Document;
  /** Scroll end callback */
  callback?: () => void;
  /** Animation duration, default as 450 */
  duration?: number;
}

/**
 * 滚动到指定位置，使用动画效果
 * @param y 目标位置，单位为像素，默认值为 0
 * @param options 选项，包括滚动容器、回调函数、动画持续时间
 * @returns 无返回值
 * @example
 * ```tsx
 * scrollTo(100, {
 *   getContainer: () => document.getElementById('scroll-container'),
 *   callback: () => {
 *     console.log('滚动完成');
 *   },
 *   duration: 1000
 * });
 * ```
 */
export default function scrollTo(y: number, options: ScrollToOptions = {}) {
  const { getContainer = () => window, callback, duration = 450 } = options;
  const container = getContainer();
  const scrollTop = getScroll(container);
  const startTime = Date.now();

  const frameFunc = () => {
    const timestamp = Date.now();
    const time = timestamp - startTime;
    const nextScrollTop = easeInOutCubic(
      time > duration ? duration : time,
      scrollTop,
      y,
      duration
    );
    if (isWindow(container)) {
      (container as Window).scrollTo(window.pageXOffset, nextScrollTop);
    } else if (
      container instanceof Document ||
      container.constructor.name === 'HTMLDocument'
    ) {
      (container as Document).documentElement.scrollTop = nextScrollTop;
    } else {
      (container as HTMLElement).scrollTop = nextScrollTop;
    }
    if (time < duration) {
      raf(frameFunc);
    } else if (typeof callback === 'function') {
      callback();
    }
  };
  raf(frameFunc);
}
