import { LayoutContextProvider } from './layout-context';

export function AppContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutContextProvider>{children}</LayoutContextProvider>;
}
