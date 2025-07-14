import { LayoutContextProvider } from './layout-context';

export const AppContextProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return <LayoutContextProvider>{children}</LayoutContextProvider>;
};
