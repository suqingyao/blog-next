import { useMemo } from 'react';
import { thumbHashToDataURL } from 'thumbhash';
import { decompressUint8Array } from '@/lib/u8array';
import { cn } from '@/lib/utils';

export function Thumbhash({ thumbHash, className }: { thumbHash: ArrayLike<number> | string; className?: string }) {
  const dataURL = useMemo(() => {
    if (typeof thumbHash === 'string') {
      return thumbHashToDataURL(decompressUint8Array(thumbHash));
    }
    return thumbHashToDataURL(thumbHash);
  }, [thumbHash]);

  return <img src={dataURL} className={cn('h-full w-full', className)} />;
}
