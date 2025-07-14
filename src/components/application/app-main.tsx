export const AppMain = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="mt-[var(--header-height)] w-full px-4">{children}</main>
  );
};
