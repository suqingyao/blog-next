import { AppHeader } from './app-header';
import { AppMain } from './app-main';
import { AppFooter } from './app-footer';

export function AppContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col items-center">
      <AppHeader />
      <AppMain>{children}</AppMain>
      <AppFooter />
    </div>
  );
}
