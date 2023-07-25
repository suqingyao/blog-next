'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import Button from './Button';

export default function Pager() {
  const router = useRouter();

  const handleClickPrevious = () => {
    console.log('上一页');
  };

  const handleClickNext = () => {
    console.log('下一页');
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        className="cursor-pointer border border-gray-400 px-3 py-2 hover:border-black dark:hover:border-white"
        onClick={handleClickPrevious}
      >
        <span>上一页</span>
      </Button>

      <Button
        className="cursor-pointer border border-gray-400 px-3 py-2 hover:border-black dark:hover:border-white"
        onClick={handleClickNext}
      >
        <span>下一页</span>
      </Button>
    </div>
  );
}
