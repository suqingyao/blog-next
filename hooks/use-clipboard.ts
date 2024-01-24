import { useCallback, useState } from 'react';
import { useMount } from './use-mount';
import { useEventListener } from './use-event-listener';

export const useClipboard = () => {
  const [text, setText] = useState('');
  const [isSupported, setIsSupported] = useState(false);

  useMount(() => {
    setIsSupported(navigator && 'clipboard' in navigator);
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
    [isSupported]
  );

  return {
    text,
    isSupported,
    copy
  };
};
