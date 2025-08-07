'use client';

import { useDate } from '@/hooks/use-date';
import { useIsMounted } from '@/hooks/use-is-mounted';

export const Time = ({ isoString }: { isoString?: string }) => {
  const date = useDate();
  const isMounted = useIsMounted();

  if (!isoString) {
    return null;
  }

  return (
    <time
      dateTime={date.formatToISO(isoString || '')}
      className="post-date whitespace-nowrap"
    >
      {date.formatDate(
        isoString || '',
        undefined,
        isMounted ? undefined : 'Asia/Shanghai'
      )}
    </time>
  );
};
