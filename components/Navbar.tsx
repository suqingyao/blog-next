'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

const links = [
  {
    label: 'Home',
    path: '/'
  },
  {
    label: 'Posts',
    path: '/posts'
  }
];

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="relative ml-auto flex h-full items-center">
      {links.map((link) => (
        <Link
          href={`${link.path}`}
          key={link.path}
          className={cn(
            'flex h-full w-20 cursor-pointer items-center justify-center hover:text-primary',
            pathname === link.path && 'text-primary'
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
};

export default Navbar;
