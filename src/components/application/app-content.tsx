export function AppContent({ children }: { children: React.ReactNode }) {
  return (
    <main className="w-full flex-1">{children}</main>
  );
}
