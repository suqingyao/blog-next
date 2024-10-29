import { cn } from '@/lib/utils';

export default function PostTitle({
  icon,
  title,
  className,
  center
}: {
  icon?: React.ReactNode;
  title?: string;
  className?: string;
  center?: boolean;
}) {
  return (
    <h2
      className={cn(
        'post-title relative mb-8 flex items-center text-4xl font-extrabold',
        {
          'justify-center': center,
          'text-center': center
        },
        className
      )}
    >
      {icon}
      <span>{title}</span>
    </h2>
  );
}
