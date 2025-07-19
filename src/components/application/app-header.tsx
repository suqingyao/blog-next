import { AppNavbar } from './app-navbar';
import { DarkToggleServer } from '../ui/dark-toggle';

export const AppHeader = () => {
  return (
    <header className="h-header fixed top-0 z-50 flex w-full items-center px-5 text-center shadow-xs backdrop-blur-sm">
      <AppNavbar />
      <DarkToggleServer />
    </header>
  );
};
