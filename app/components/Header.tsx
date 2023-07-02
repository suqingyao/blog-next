'use client';
import React from 'react';
import DarkToggle from './DarkToggle';

export default function Header() {
  return (
    <header
      className="
        sticky
        top-0
        z-50
        flex
        items-center
        justify-end
        px-5
        py-6
        text-center
        backdrop-blur-sm
      "
    >
      <DarkToggle />
    </header>
  );
}
