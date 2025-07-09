'use client';

import { LazyImage } from '@/components/lazy-image';
import { OSS_URL_PREFIX } from '@/lib/constants';
import { useRouter } from 'next/navigation';

interface Props {
  params: { album: string; image: string };
}

export default function PhotosModalPage({ params }: Props) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative flex w-full max-w-4xl flex-col items-center">
        {/* 关闭按钮 */}
        <button
          className="absolute right-2 top-2 z-10 rounded-full bg-black/60 p-2 text-white transition hover:bg-black/80"
          onClick={() => router.back()}
          aria-label="关闭"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        {/* 图片自适应居中 */}
        <LazyImage
          src={`${OSS_URL_PREFIX}/${params.album}/${params.image}`}
          alt={params.image}
          className="max-h-[80vh] w-auto rounded-lg bg-white object-contain shadow-lg"
        />
      </div>
    </div>
  );
}
