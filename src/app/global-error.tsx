'use client';

import { useTheme } from 'next-themes';
import { useEffect } from 'react';
import Lottie from 'react-lottie';
import { consoleLog } from '@/lib/console';
import errorDarkData from '@/lottie/error-dark.json';
import errorData from '@/lottie/error.json';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { theme } = useTheme();

  useEffect(() => {
    consoleLog('ERROR', 'GlobalError:', error);
  }, [error]);

  return (
    <div className="container flex h-full items-center justify-center">
      <div>
        <Lottie
          options={{
            loop: false,
            autoplay: true,
            animationData: theme === 'dark' ? errorDarkData : errorData,
            rendererSettings: {
              preserveAspectRatio: 'xMidYMid slice',
            },
          }}
          height="60%"
          width="60%"
        />

        <button
          className="text-link mx-auto mt-10 block text-xl opacity-40 hover:opacity-100"
          onClick={reset}
        >
          Try again
        </button>
      </div>
    </div>
  );
}
