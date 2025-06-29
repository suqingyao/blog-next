'use client';

import Link from 'next/link';
import animationData from '@/lottie/animation404.json';
import dynamic from 'next/dynamic';

const Lottie = dynamic(() => import('react-lottie'), { ssr: false });

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center">
      <Lottie
        options={{
          loop: true,
          autoplay: true,
          animationData,
          rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
          }
        }}
        height="100%"
        width="100%"
      />

      <Link
        href="/"
        className="text-link mt-10 text-xl opacity-40 hover:opacity-100"
      >
        Back to Home
      </Link>
    </div>
  );
}
