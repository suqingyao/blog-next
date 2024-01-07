'use client';

import Link from 'next/link';
import Lottie from 'react-lottie';
import animationData from '@/lottie/animation404.json';

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
        height={400}
        width={400}
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
