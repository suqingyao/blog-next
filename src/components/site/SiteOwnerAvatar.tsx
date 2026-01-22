'use client';

import Image from 'next/image';
import { memo } from 'react';
import { cn } from '@/lib/utils';

interface SiteOwnerAvatarProps {
  className?: string;
}

export const SiteOwnerAvatar = memo<SiteOwnerAvatarProps>(({ className }) => {
  const avatar = '/avatar.png'; // 网站头像路径

  return (
    <div
      role="img"
      className={cn(
        'pointer-events-none relative z-[9] size-[40px] select-none',
        className,
      )}
    >
      <div className={cn('mask mask-squircle', 'overflow-hidden')}>
        <Image
          src={avatar}
          alt="Site Owner Avatar"
          width={40}
          height={40}
          className="ring-2 ring-slate-200 dark:ring-neutral-800"
        />
      </div>
    </div>
  );
});

SiteOwnerAvatar.displayName = 'SiteOwnerAvatar';
