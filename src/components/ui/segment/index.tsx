import type { ReactNode } from 'react';
import { m } from 'motion/react';
import { use, useId, useMemo, useState } from 'react';
import { Spring } from '@/lib/spring';
import { cn } from '@/lib/utils';

import { SegmentGroupContext } from './ctx';

interface SegmentGroupProps {
  value?: string;
  onValueChanged?: (value: string) => void;
}
export function SegmentGroup(props: ComponentType<SegmentGroupProps>) {
  const { onValueChanged, value, className } = props;

  const [currentValue, setCurrentValue] = useState(value || '');
  const componentId = useId();

  return (
    <SegmentGroupContext.Provider
      value={useMemo(
        () => ({
          value: currentValue,
          setValue: (value) => {
            setCurrentValue(value);
            onValueChanged?.(value);
          },
          componentId,
        }),
        [componentId, currentValue, onValueChanged],
      )}
    >
      <div
        role="tablist"
        className={cn(
          'bg-fill-tertiary text-text-secondary inline-flex h-9 items-center justify-center rounded-lg p-1 outline-none',
          className,
        )}
        tabIndex={0}
        data-orientation="horizontal"
      >
        {props.children}
      </div>
    </SegmentGroupContext.Provider>
  );
}

export const SegmentItem: Component<{
  value: string;
  label: ReactNode;
  activeBgClassName?: string;
}> = ({ label, value, className, activeBgClassName }) => {
  const ctx = use(SegmentGroupContext);
  const isActive = ctx.value === value;
  const { setValue } = ctx;
  const layoutId = ctx.componentId;
  return (
    <button
      type="button"
      role="tab"
      className={cn(
        'ring-offset-background data-[state=active]:text-text relative inline-flex items-center justify-center px-3 text-sm font-medium whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
        'focus-visible:ring-accent/30 h-full rounded-md',
        className,
      )}
      tabIndex={-1}
      data-orientation="horizontal"
      onClick={() => {
        setValue(value);
      }}
      data-state={isActive ? 'active' : 'inactive'}
    >
      <span className="z-[1]">{label}</span>

      {isActive && (
        <m.span
          layout
          transition={Spring.presets.smooth}
          layoutId={layoutId}
          className={cn('absolute inset-0 z-0 rounded-md', activeBgClassName || 'bg-background')}
        />
      )}
    </button>
  );
};
