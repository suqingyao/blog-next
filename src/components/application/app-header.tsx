import { AppNavbar } from './app-navbar';

export function AppHeader() {
  return (
    <header className="h-header fixed top-0 z-50 flex w-full items-center px-5 text-center shadow-xs backdrop-blur-sm">
      <AppNavbar />
    </header>
  );
}
