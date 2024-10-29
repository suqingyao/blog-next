import { PlumContainer } from '@/components/plum-container';

export default function PostLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <PlumContainer />
    </>
  );
}
