'use client';

import Lottie from 'react-lottie';
import errorDarkData from '@/lottie/error-dark.json';
import errorData from '@/lottie/error.json';
import { useTheme } from 'next-themes';
import { useEffect } from 'react';

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { theme } = useTheme();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center">
      <Lottie
        options={{
          loop: true,
          autoplay: true,
          animationData: theme === 'dark' ? errorDarkData : errorData,
          rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
          }
        }}
        height="100%"
        width="100%"
      />

      <button
        className="text-link mt-10 text-xl opacity-40 hover:opacity-100"
        onClick={reset}
      >
        Try again
      </button>
    </div>
  );
}
