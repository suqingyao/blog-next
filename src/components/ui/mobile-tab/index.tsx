import type { ReactNode } from 'react';
import { m } from 'motion/react';
import { use, useId, useMemo, useState } from 'react';
import { Spring } from '@/lib/spring';
import { cn } from '@/lib/utils';

import { MobileTabGroupContext } from './ctx';

interface MobileTabGroupProps {
  value?: string;
  onValueChanged?: (value: string) => void;
}

export function MobileTabGroup(props: ComponentType<MobileTabGroupProps>) {
  const { onValueChanged, value, className } = props;

  const [currentValue, setCurrentValue] = useState(value || '');
  const componentId = useId();

  return (
    <MobileTabGroupContext.Provider
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
        className={cn('relative flex items-center border-b border-accent/10 px-4 pb-3 pt-4', className)}
        tabIndex={0}
        data-orientation="horizontal"
      >
        <div className="flex flex-1 gap-1">{props.children}</div>
      </div>
    </MobileTabGroupContext.Provider>
  );
}

export const MobileTabItem: Component<{
  value: string;
  label: ReactNode;
  activeBgClassName?: string;
}> = ({ label, value, className, activeBgClassName }) => {
  const ctx = use(MobileTabGroupContext);
  const isActive = ctx.value === value;
  const { setValue } = ctx;
  const layoutId = ctx.componentId;

  return (
    <button
      type="button"
      role="tab"
      className={cn(
        'relative flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 font-medium text-sm transition-colors',
        'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
        'focus-visible:ring-accent/30',
        isActive ? 'text-white' : 'text-white/60 hover:text-white/80',
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
        <m.div
          layout
          layoutId={layoutId}
          transition={Spring.presets.smooth}
          className={cn('absolute inset-x-0 bottom-0 h-0.5 bg-accent/60 rounded-full', activeBgClassName)}
        />
      )}
    </button>
  );
};
