import type { ReactEventHandler } from 'react';
import { NOOP } from './constants';
import { isWindow } from './is';

export const transitionViewIfSupported = (callback: () => void) => {
  const isAppearanceTransition =
    // @ts-expect-error experimental API
    document.startViewTransition &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!isAppearanceTransition) {
    callback();
    return;
  }

  return document.startViewTransition(callback);
};

export const stopPropagation: ReactEventHandler<any> = (e) =>
  e.stopPropagation();

export const preventDefault: ReactEventHandler<any> = (e) => e.preventDefault();

const isServerRendering = (function () {
  try {
    return !(typeof window !== 'undefined' && document !== undefined);
  } catch (error) {
    return true;
  }
})();

export const on = (function () {
  if (isServerRendering) {
    return NOOP;
  }
  return function (
    element: EventTarget | null,
    event: keyof WindowEventMap,
    handler: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ) {
    element && element.addEventListener(event, handler, options || false);
  };
})();

export const off = (function () {
  if (isServerRendering) {
    return NOOP;
  }
  return function (
    element: EventTarget | null,
    event: keyof WindowEventMap,
    handler: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ) {
    element && element.removeEventListener(event, handler, options || false);
  };
})();

export function getTargetRect(target: HTMLElement | Window) {
  return isWindow(target)
    ? {
        top: 0,
        bottom: window.innerHeight
      }
    : target.getBoundingClientRect();
}
