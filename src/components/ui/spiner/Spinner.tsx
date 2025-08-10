import type { ClassValue } from 'clsx';
import { cn } from '@/lib/utils';

export function Spinner({ ref, className, size }: {
  size?: number;
  className?: string;
} & { ref?: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div
      className={className}
      ref={ref}
    >
      <div
        className="loading loading-dots"
        style={{
          width: size || '2rem',
          height: size || '2rem',
        }}
      />
    </div>
  );
}

Spinner.displayName = 'Spinner';

export function AbsoluteCenterSpinner({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: ClassValue;
}) {
  return (
    <div
      className={cn(
        'inset-0 z-10 flex flex-col items-center justify-center gap-6',
        className,
      )}
    >
      <Spinner />
      {children}
    </div>
  );
}
