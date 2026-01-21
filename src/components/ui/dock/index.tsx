'use client';

import type {
  MotionValue,
  SpringOptions,
} from 'motion/react';
import {
  AnimatePresence,
  m,
  useMotionValue,
  useSpring,
  useTransform,
} from 'motion/react';
import React, { Children, cloneElement, useEffect, useMemo, useRef, useState } from 'react';

export interface DockItemData {
  icon: React.ReactNode;
  label: React.ReactNode;
  onClick: () => void;
  className?: string;
}

export interface DockProps {
  items: DockItemData[];
  className?: string;
  distance?: number;
  panelHeight?: number;
  baseItemSize?: number;
  dockHeight?: number;
  magnification?: number;
  spring?: SpringOptions;
}

interface DockItemProps {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  mouseX: MotionValue<number>;
  spring: SpringOptions;
  distance: number;
  baseItemSize: number;
  magnification: number;
}

function DockItem({
  children,
  className = '',
  onClick,
  mouseX,
  spring,
  distance,
  magnification,
  baseItemSize,
}: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, (val) => {
    const rect = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      width: baseItemSize,
    };
    return val - rect.x - baseItemSize / 2;
  });

  const targetSize = useTransform(mouseDistance, [-distance, 0, distance], [baseItemSize, magnification, baseItemSize]);
  const size = useSpring(targetSize, spring);

  return (
    <m.div
      ref={ref}
      style={{
        width: size,
        height: size,
      }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center rounded-lg transition-all ${className}`}
      tabIndex={0}
      role="button"
      aria-haspopup="true"
    >
      {/* Liquid Glass Background - Optimized */}
      <div
        className="absolute inset-0 rounded-lg backdrop-blur-lg"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--color-base-200) 50%, transparent)',
          backgroundImage: 'linear-gradient(135deg, color-mix(in srgb, white 8%, transparent) 0%, transparent 50%, color-mix(in srgb, black 3%, transparent) 100%)',
          boxShadow: 'inset 0 1px 0 0 color-mix(in srgb, white 12%, transparent), inset 0 -1px 0 0 color-mix(in srgb, black 6%, transparent)',
          border: '0.5px solid color-mix(in srgb, var(--color-base-content) 10%, transparent)',
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {Children.map(children, child =>
          React.isValidElement(child)
            ? cloneElement(child as React.ReactElement<{ isHovered?: MotionValue<number> }>, { isHovered })
            : child)}
      </div>

      {/* Outer glow on hover */}
      <m.div
        className="absolute inset-0 rounded-[18px] pointer-events-none"
        style={{
          boxShadow: '0 0 20px color-mix(in srgb, var(--color-primary) 30%, transparent)',
          opacity: 0,
        }}
        animate={{
          opacity: isHovered.get() === 1 ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
      />
    </m.div>
  );
}

interface DockLabelProps {
  className?: string;
  children: React.ReactNode;
  isHovered?: MotionValue<number>;
}

function DockLabel({ children, className = '', isHovered }: DockLabelProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isHovered)
      return;
    const unsubscribe = isHovered.on('change', (latest) => {
      setIsVisible(latest === 1);
    });
    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <m.div
          initial={{ opacity: 0, y: 0, scale: 0.9 }}
          animate={{ opacity: 1, y: -10, scale: 1 }}
          exit={{ opacity: 0, y: 0, scale: 0.9 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className={`${className} absolute -top-10 left-1/2 w-fit whitespace-pre rounded-xl px-3 py-1.5 text-xs font-medium`}
          style={{
            x: '-50%',
            color: 'var(--color-base-content)',
          }}
          role="tooltip"
        >
          {/* Liquid Glass Tooltip - Optimized */}
          <div
            className="absolute inset-0 rounded-xl backdrop-blur-2xl"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--color-base-200) 85%, transparent)',
              backgroundImage: 'linear-gradient(to bottom, color-mix(in srgb, white 10%, transparent) 0%, transparent 50%)',
              boxShadow: 'inset 0 1px 0 0 color-mix(in srgb, white 15%, transparent)',
              border: '0.5px solid color-mix(in srgb, var(--color-base-content) 10%, transparent)',
            }}
          />

          {/* Content */}
          <div className="relative z-10">
            {children}
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}

interface DockIconProps {
  className?: string;
  children: React.ReactNode;
  isHovered?: MotionValue<number>;
}

function DockIcon({ children, className = '' }: DockIconProps) {
  return (
    <div className={`flex items-center justify-center w-full h-full ${className}`}>
      {children}
    </div>
  );
}

export function Dock({
  items,
  className = '',
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = 70,
  distance = 200,
  panelHeight = 64,
  dockHeight = 256,
  baseItemSize = 50,
}: DockProps) {
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);

  const maxHeight = useMemo(() => Math.max(dockHeight, magnification + magnification / 2 + 4), [magnification]);
  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
  const height = useSpring(heightRow, spring);

  return (
    <m.div style={{ height, scrollbarWidth: 'none' }} className="mx-2 flex max-w-full items-center justify-center">
      <m.div
        onMouseMove={({ pageX }) => {
          isHovered.set(1);
          mouseX.set(pageX);
        }}
        onMouseLeave={() => {
          isHovered.set(0);
          mouseX.set(Infinity);
        }}
        className={`${className} absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-end w-fit gap-1 rounded-2xl pb-1.5 px-2`}
        style={{
          height: panelHeight,
        }}
        role="toolbar"
        aria-label="Application dock"
      >
        {/* Liquid Glass Dock Background - Optimized */}
        <div
          className="absolute inset-0 rounded-2xl backdrop-blur-2xl -z-10"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--color-base-200) 25%, transparent)',
            backgroundImage: 'linear-gradient(135deg, color-mix(in srgb, white 12%, transparent) 0%, transparent 50%, color-mix(in srgb, black 5%, transparent) 100%)',
            boxShadow: `
              inset 0 1px 0 0 color-mix(in srgb, white 20%, transparent),
              inset 0 -1px 0 0 color-mix(in srgb, black 5%, transparent),
              0 10px 40px color-mix(in srgb, black 25%, transparent),
              0 4px 12px color-mix(in srgb, black 12%, transparent)
            `,
            border: '0.5px solid color-mix(in srgb, var(--color-base-content) 10%, transparent)',
          }}
        />

        {/* Items */}
        <div className="relative z-10 flex items-end gap-2">
          {items.map((item, index) => (
            <DockItem
              key={`dock-item-${index}-${item.label}`}
              onClick={item.onClick}
              className={item.className}
              mouseX={mouseX}
              spring={spring}
              distance={distance}
              magnification={magnification}
              baseItemSize={baseItemSize}
            >
              <DockIcon>{item.icon}</DockIcon>
              <DockLabel>{item.label}</DockLabel>
            </DockItem>
          ))}
        </div>
      </m.div>
    </m.div>
  );
}
