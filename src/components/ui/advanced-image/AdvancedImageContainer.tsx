'use client';

import dynamic from 'next/dynamic';

const AdvancedImage = dynamic(
  () => import('./AdvancedImage').then((mod) => mod.AdvancedImage),
  {
    ssr: false
  }
);

export const AdvancedImageContainer = (props: any) => {
  return <AdvancedImage {...props} />;
};
