import { useEffect, useRef, useState } from 'react';

const toDataURL = (img: HTMLImageElement) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  ctx?.drawImage(img, 0, 0);
  return canvas.toDataURL();
};

export const useImage = (src: string, crossOrigin = '') => {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'failed'>(
    'loading'
  );
  const [dataUrl, setDataUrl] = useState<string | undefined>();
  const imgRef = useRef<HTMLImageElement>();

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = crossOrigin;
    img.onload = () => {
      imgRef.current = img;
      setStatus('loaded');
      setDataUrl(toDataURL(img));
    };
    img.onerror = () => {
      setStatus('failed');
    };
    img.src = src;
    return () => {
      imgRef.current = undefined;
      setStatus('loading');
    };
  }, [src, crossOrigin]);

  return {
    image: imgRef.current,
    status,
    dataUrl
  };
};
