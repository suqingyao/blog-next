'use client';

import Link from 'next/link';

const ErrorPage = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <h2 className="py-20 text-3xl">Something went wrong</h2>
      <Link
        href="/"
        className="text-sm text-gray-300 hover:underline"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default ErrorPage;
