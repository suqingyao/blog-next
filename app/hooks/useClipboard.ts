import { useEventListener, useMount } from 'ahooks';
import { useCallback, useEffect, useRef, useState } from 'react';

const useClipboard = () => {
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
    (value: string) => {
      if (isSupported) {
        navigator.clipboard.writeText(value);
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

export default useClipboard;
