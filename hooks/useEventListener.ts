import { RefObject, useEffect, useRef } from 'react';

type EventHandler<T = Event> = (event: T) => void;

export const useEventListener = <T extends HTMLElement = HTMLElement>(
  eventName: keyof WindowEventMap,
  handler: EventHandler,
  element?: RefObject<T> | Window | null
) => {
  // 保存事件处理函数，确保在重新渲染时处理函数不变
  const savedHandler = useRef<EventHandler>();

  // 在组件挂载或更新时更新保存的事件处理函数
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  // 添加事件监听器和移除事件监听器
  useEffect(() => {
    const eventListener: EventHandler = (event) => {
      if (savedHandler.current) savedHandler.current(event);
    };

    // 如果 element 不存在或无法添加监听器，则退出
    if (!element || !element.addEventListener) {
      return;
    }

    // 选择目标元素
    const targetElement: T | Window | null =
      element && 'current' in element ? element.current : element;

    if (!targetElement) return;

    // 向 targetElement 添加事件监听器
    targetElement.addEventListener(eventName, eventListener);

    // 在组件卸载和 eventName 或 element 变化时移除事件监听器
    return () => {
      targetElement.removeEventListener(eventName, eventListener);
    };
  }, [eventName, element]);
};
