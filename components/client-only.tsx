'use client';

import { useEffect, useState } from 'react';

type ClientOnlyProps = {
  children: React.ReactNode;
};

export const ClientOnly = ({ children }: ClientOnlyProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted ? <>{children}</> : null;
};
