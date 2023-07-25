'use client';

import { useRouter } from 'next/navigation';
import DarkToggle from './DarkToggle';

export default function Header() {
  const router = useRouter();
  const links = [
    {
      label: 'Home',
      path: '/'
    },
    {
      label: 'Post',
      path: '/post'
    }
  ];

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
      {links.map((link) => (
        <span
          key={link.path}
          onClick={() => router.push(link.path)}
          className="mx-2 cursor-pointer hover:font-semibold hover:text-primary"
        >
          {link.label}
        </span>
      ))}
      <DarkToggle />
    </header>
  );
}
