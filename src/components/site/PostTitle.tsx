'use client';

import { useEffect } from 'react';
import { useHeaderAtom } from '@/store/hooks/use-header-atom';
import { cn } from '@/lib/utils';

export default function PostTitle({
  icon,
  className,
  center,
  post
}: {
  icon?: React.ReactNode;
  className?: string;
  center?: boolean;
  post: Post;
}) {
  const { setHeaderAtom } = useHeaderAtom();

  useEffect(() => {
    setHeaderAtom({
      pageTitle: post.title,
      pageTitleElement: document.querySelector('.post-title') as HTMLHeadElement
    });
    return () => {
      setHeaderAtom({
        pageTitle: '',
        pageTitleElement: null
      });
    };
  }, [post.title]);

  return (
    <h2
      className={cn(
        'post-title relative my-4 flex items-center text-xl font-extrabold',
        {
          'justify-center': center,
          'text-center': center
        },
        className
      )}
    >
      {icon}
      <span>{post.title}</span>
    </h2>
  );
}
