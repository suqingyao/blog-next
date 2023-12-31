'use client';

import { useEffect, useState } from 'react';
import type { FC, PropsWithChildren } from 'react';

const ClientOnly: FC<PropsWithChildren> = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted ? <>{children}</> : null;
};

export default ClientOnly;
