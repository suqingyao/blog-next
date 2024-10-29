import dynamic from 'next/dynamic';
import { AppNavbar } from './app-navbar';

const DarkToggle = dynamic(
  async () => (await import('../ui/dark-toggle')).DarkToggle,
  {
    ssr: false
  }
);

export const AppHeader = () => {
  return (
    <header className="fixed top-0 z-50 flex h-[var(--header-height)] w-full items-center px-5 text-center shadow-sm backdrop-blur-sm">
      <AppNavbar />
      <DarkToggle />
    </header>
  );
};
