import { AppFooter } from './app-footer';
import { AppHeader } from './app-header';

export function Content({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col items-center">
      <AppHeader />
      <main className="mt-[var(--header-height)] w-[75ch]">{children}</main>
      <AppFooter />
    </div>
  );
}
