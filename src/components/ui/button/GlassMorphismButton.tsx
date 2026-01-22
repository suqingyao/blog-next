import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface GlassMorphismButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
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

  /**
   * 子元素
   */
  children: ReactNode;

  /**
   * 额外的 className
   */
  className?: string;
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
export const GlassMorphismButton = forwardRef<HTMLButtonElement, GlassMorphismButtonProps>(
  ({ variant = 'rectangle', size = 'md', children, className, ...props }, ref) => {
    // 基础玻璃效果样式
    const baseStyles = cn(
      // 背景和边框
      'bg-white/60 text-slate-700',
      'border border-slate-200/50',
      'shadow-sm shadow-black/5',
      'backdrop-blur-sm',
      // Dark Mode
      'dark:bg-white/10 dark:text-white',
      'dark:border-white/20',
      'dark:shadow-black/20',
      // 过渡动画
      'transition-all duration-200',
      // Hover 状态
      'hover:bg-white/80',
      'dark:hover:bg-white/15',
      // Active 状态
      'active:scale-95',
    );

    // 变体样式
    const variantStyles = {
      rectangle: cn(
        'rounded-xl px-3 py-2',
        'flex items-center gap-2',
        'text-sm',
        'hover:scale-105',
      ),
      circle: cn(
        'rounded-full',
        'flex items-center justify-center',
        'hover:scale-110',
      ),
    };

    // 尺寸样式（仅对 circle 变体有效）
    const sizeStyles = variant === 'circle'
      ? {
          sm: 'size-8',
          md: 'size-9',
          lg: 'size-10',
          auto: '',
        }
      : { sm: '', md: '', lg: '', auto: '' };

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

GlassMorphismButton.displayName = 'GlassMorphismButton';
