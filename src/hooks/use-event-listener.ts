import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';

type EventHandler<T = Event> = (event: T) => void;

export function useEventListener<T extends HTMLElement = HTMLElement>(eventName: keyof WindowEventMap, handler: EventHandler, element?: RefObject<T> | Window | null) {
  const savedHandler = useRef<EventHandler>(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const targetElement
      = element && 'current' in element ? element.current : element;

    const eventListener: EventHandler = (event) => {
      if (savedHandler.current)
        savedHandler.current(event);
    };

    const validElement: T | Window | null
      = targetElement && 'addEventListener' in targetElement
        ? targetElement
        : null;

    if (!validElement) {
      return;
    }

    validElement.addEventListener(eventName, eventListener);

    return () => {
      validElement.removeEventListener(eventName, eventListener);
    };
  }, [eventName, element]);
}
