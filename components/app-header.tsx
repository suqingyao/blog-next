import dynamic from 'next/dynamic';
import { AppNavbar } from './app-navbar';

const DarkToggle = dynamic(
  () => import('./dark-toggle').then((mod) => mod.DarkToggle),
  { ssr: false }
);

export const AppHeader = () => {
  return (
    <header className="fixed left-0 top-0 z-50 flex h-[var(--header-height)] w-full items-center px-5 text-center shadow-sm backdrop-blur-sm">
      <AppNavbar />
      <DarkToggle />
    </header>
  );
};
