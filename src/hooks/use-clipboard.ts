import { useCallback, useState } from 'react';
import { useEventListener } from './use-event-listener';
import { useMount } from './use-mount';

export function useClipboard() {
  const [text, setText] = useState('');
  const [isSupported, setIsSupported] = useState(false);

  useMount(() => {
    setIsSupported(
      typeof window !== 'undefined'
      && typeof navigator !== 'undefined'
      && !!navigator.clipboard
      && typeof navigator.clipboard.writeText === 'function',
    );
  });

  const updateText = async () => {
    if (isSupported) {
      const text = await navigator.clipboard.readText();
      setText(text);
    }
  };

  useEventListener('copy', updateText);
  useEventListener('cut', updateText);

  const copy = useCallback(
    async (value: string) => {
      if (isSupported) {
        await navigator.clipboard.writeText(value);
      }
    },
    [isSupported],
  );

  return {
    text,
    isSupported,
    copy,
  };
}
