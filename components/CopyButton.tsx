'use client';

import React from 'react';
import { BiCopy } from 'react-icons/bi';

export default function CopyButton() {
  const handleCopy = () => {};

  return (
    <BiCopy
      size={20}
      className="absolute right-0 top-0 hover:cursor-pointer peer-hover:block"
      onClick={handleCopy}
    />
  );
}
