'use client';

import { LazyImage } from '@/components/lazy-image';
import { useEventListener } from '@/hooks/use-event-listener';
import { OSS_URL_PREFIX } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface Props {
  params: { album: string; image: string };
}

export default function PhotosModalPage({ params }: Props) {
  const router = useRouter();

  useEventListener(
    'keydown',
    (e) => {
      if ((e as KeyboardEvent).key === 'Escape') {
        router.back();
      }
    },
    window
  );

  useEffect(() => {
    // 禁止滚动
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm">
      {/* 关闭按钮 */}
      <button
        className="i-mingcute-close-fill absolute left-2 top-2 z-10 rounded-full bg-black/60 p-2 text-3xl text-white transition hover:bg-black/80"
        onClick={() => router.back()}
        aria-label="关闭"
      ></button>
      <div className="flex w-full max-w-4xl flex-col items-center">
        {/* 图片自适应居中 */}
        <LazyImage
          src={`${OSS_URL_PREFIX}/${params.album}/${params.image}`}
          alt={params.image}
          className="max-h-[80vh] min-h-[50vh] w-auto rounded-lg bg-white object-contain shadow-lg"
        />
      </div>
    </div>
  );
}
