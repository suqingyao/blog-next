import type { HTMLMotionProps } from 'motion/react';
import type { VariantProps } from 'tailwind-variants';
import { m } from 'motion/react';
import * as React from 'react';
import { tv } from 'tailwind-variants';
import { cn, focusRing } from '@/lib/utils';

const glassMorphismButtonVariants = tv({
  base: [
    'relative inline-flex items-center justify-center whitespace-nowrap text-center font-medium',
    'transition-all duration-200 ease-in-out',
    // 玻璃形态基础样式
    'bg-white/60 text-slate-700',
    'border border-slate-200/50',
    'shadow-sm shadow-black/5',
    'backdrop-blur-sm',
    // Dark Mode
    'dark:bg-white/10 dark:text-white',
    'dark:border-white/20',
    'dark:shadow-black/20',
    // Hover 状态
    'hover:bg-white/80',
    'dark:hover:bg-white/15',
    // 禁用状态
    'disabled:pointer-events-none',
    'disabled:opacity-50',
    focusRing,
  ],
  variants: {
    variant: {
      rectangle: [
        'rounded-xl',
        'px-3 py-2',
        'gap-2',
        'text-sm',
        'hover:scale-105',
        'active:scale-95',
      ],
      circle: [
        'rounded-full',
        'hover:scale-110',
        'active:scale-95',
      ],
    },
    size: {
      sm: '',
      md: '',
      lg: '',
      auto: '',
    },
  },
  compoundVariants: [
    // Circle 变体的尺寸
    {
      variant: 'circle',
      size: 'sm',
      className: 'size-8',
    },
    {
      variant: 'circle',
      size: 'md',
      className: 'size-9',
    },
    {
      variant: 'circle',
      size: 'lg',
      className: 'size-10',
    },
  ],
  defaultVariants: {
    variant: 'rectangle',
    size: 'md',
  },
});

interface GlassMorphismButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'ref'>,
  VariantProps<typeof glassMorphismButtonVariants> {
  /**
   * 按钮变体
   * - rectangle: 圆角矩形（默认）
   * - circle: 完全圆形
   */
  variant?: 'rectangle' | 'circle';

  /**
   * 按钮尺寸
   * - sm: 小尺寸 (size-8)
   * - md: 中等尺寸 (size-9) - 默认
   * - lg: 大尺寸 (size-10)
   * - auto: 自动尺寸（根据内容）
   */
  size?: 'sm' | 'md' | 'lg' | 'auto';
}

/**
 * GlassMorphismButton - 玻璃形态按钮
 *
 * 特点：
 * - 半透明背景 + 毛玻璃模糊
 * - Hover 放大效果
 * - Active 缩小反馈
 * - Dark Mode 自动适配
 *
 * @example
 * // 圆形图标按钮
 * <GlassMorphismButton variant="circle" size="md">
 *   <i className="i-mingcute-search-line" />
 * </GlassMorphismButton>
 *
 * @example
 * // 矩形按钮（带文字）
 * <GlassMorphismButton variant="rectangle">
 *   <i className="i-mingcute-search-line" />
 *   <span>Search</span>
 *   <kbd>⌘K</kbd>
 * </GlassMorphismButton>
 */
function GlassMorphismButton({
  ref: forwardedRef,
  variant,
  size,
  className,
  children,
  ...props
}: GlassMorphismButtonProps & {
  ref?: React.RefObject<HTMLButtonElement>;
}) {
  return (
    <m.button
      ref={forwardedRef}
      type="button"
      className={cn(glassMorphismButtonVariants({ variant, size }), className)}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {children}
    </m.button>
  );
}

GlassMorphismButton.displayName = 'GlassMorphismButton';

export { GlassMorphismButton, type GlassMorphismButtonProps, glassMorphismButtonVariants };
