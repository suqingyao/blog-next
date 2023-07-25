import React, { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <h1>hello</h1>
      {children}
    </div>
  );
}
