'use client';

import { useRouter } from 'next/navigation';
import { memo, useCallback } from 'react';
import { SiteOwnerAvatar } from './SiteOwnerAvatar';

const TapableLogo = memo(() => {
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.push('/');
  }, [router]);

  return (
    <button onClick={handleClick} type="button">
      <SiteOwnerAvatar className="cursor-pointer" />
      <span className="sr-only">Home</span>
    </button>
  );
});

TapableLogo.displayName = 'TapableLogo';

export const AnimatedLogo = memo(() => {
  return <TapableLogo />;
});

AnimatedLogo.displayName = 'AnimatedLogo';
