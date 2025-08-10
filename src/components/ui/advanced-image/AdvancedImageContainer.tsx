'use client';

import dynamic from 'next/dynamic';

const AdvancedImage = dynamic(
  async () => import('./AdvancedImage').then(mod => mod.AdvancedImage),
  {
    ssr: false,
  },
);

export function AdvancedImageContainer(props: any) {
  return <AdvancedImage {...props} />;
}
