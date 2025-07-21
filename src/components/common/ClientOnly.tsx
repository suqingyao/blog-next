'use client';

import { useEffect, useState } from 'react';

export const ClientOnly = ({ children }: { children?: React.ReactNode }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted ? children : null;
};
