import type { FC, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface LinearBorderContainerProps {
  children: ReactNode;
  className?: string;

  /**
   * Color tint for the border gradient.
   * @default 'var(--color-text-secondary)' - Uses the default text secondary color
   * @example 'var(--color-accent)' - Uses the accent color
   * @example 'var(--color-red)' - Uses the red system color
   */
  tint?: string;
}

/**
 * A container with linear gradient borders on all sides.
 * Creates a sophisticated border effect using CSS gradients.
 *
 * @example
 * ```tsx
 * <LinearBorderContainer className="bg-background-tertiary">
 *   <div className="p-12">
 *     <h1>Content with linear gradient borders</h1>
 *   </div>
 * </LinearBorderContainer>
 * ```
 *
 * @example With custom tint
 * ```tsx
 * <LinearBorderContainer tint="var(--color-accent)">
 *   <div>Accent-colored borders</div>
 * </LinearBorderContainer>
 * ```
 */
export const LinearBorderContainer: FC<LinearBorderContainerProps> = ({
  children,
  className,
  tint = 'var(--color-text-secondary)',
}) => {
  // Generate inline styles for gradients with dynamic tint color
  const horizontalGradient = {
    background: `linear-gradient(to right, transparent, ${tint}, transparent)`,
  };
  const verticalGradient = {
    background: `linear-gradient(to bottom, transparent -15%, ${tint} 50%, transparent 115%)`,
  };

  return (
    <div className="flex flex-col">
      <div className={cn('flex flex-row', className)}>
        {/* Top border */}
        <div className="absolute right-0 left-0 z-1 h-[0.5px]" style={horizontalGradient} />

        {/* Left border */}
        <div className="absolute top-0 bottom-0 z-1 w-[0.5px]" style={verticalGradient} />

        {/* Main content area */}
        {children}

        {/* Right border */}
        <div className="flex shrink-0 flex-col">
          <div className="absolute top-0 bottom-0 z-1 w-[0.5px]" style={verticalGradient} />
        </div>
      </div>

      {/* Bottom border */}
      <div className="w-[2px] shrink-0">
        <div className="absolute right-0 left-0 z-1 h-[0.5px]" style={horizontalGradient} />
      </div>
    </div>
  );
};
