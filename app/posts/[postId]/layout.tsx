import { ReactNode } from 'react';
import Pager from './components/Pager';

export default function PostLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <main className="">{children}</main>
      <Pager />
    </>
  );
}
