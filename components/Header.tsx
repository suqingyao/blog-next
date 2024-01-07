import dynamic from 'next/dynamic';
import { Navbar } from './Navbar';

const DarkToggle = dynamic(() => import('./DarkToggle'), { ssr: false });

export default function Header() {
  return (
    <header className="fixed left-0 top-0 z-50 flex h-[var(--header-height)] w-full items-center px-5 text-center shadow-sm backdrop-blur-sm">
      <Navbar />
      <DarkToggle />
    </header>
  );
}
