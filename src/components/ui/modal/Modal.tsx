'use client';

import { ReactNode } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { motion, TargetAndTransition, VariantLabels } from 'motion/react';
import { cn } from '@/lib/utils';

export interface ModalProps {
  /** 是否打开模态框 */
  open: boolean;
  /** 模态框状态改变时的回调 */
  onOpenChange?: (open: boolean) => void;
  /** 模态框内容 */
  children: ReactNode;
  /** 模态框标题（用于可访问性） */
  title?: string;
  /** 模态框描述（用于可访问性） */
  description?: string;
  /** 自定义样式类名 */
  className?: string;
  /** 是否显示关闭按钮 */
  showCloseButton?: boolean;
  /** 关闭按钮点击回调 */
  onClose?: () => void;
  /** 动画配置 */
  animation?: {
    initial?: TargetAndTransition | VariantLabels;
    animate?: TargetAndTransition | VariantLabels;
    exit?: TargetAndTransition | VariantLabels;
  };
  /** 遮罩层样式类名 */
  overlayClassName?: string;
  /** 内容区域样式类名 */
  contentClassName?: string;
}

/**
 * 基础模态框组件
 * 基于 @radix-ui/react-dialog 和 motion/react 构建
 */
export function Modal({
  open,
  onOpenChange,
  children,
  title,
  description,
  className,
  showCloseButton = true,
  onClose,
  animation = {
    initial: { opacity: 0, scale: 0.95, y: -20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: -20 }
  },
  overlayClassName,
  contentClassName
}: ModalProps) {
  /**
   * 处理关闭事件
   */
  const handleClose = () => {
    onClose?.();
    onOpenChange?.(false);
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={onOpenChange}
    >
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm',
              overlayClassName
            )}
          />
        </Dialog.Overlay>
        <Dialog.Content asChild>
          <motion.div
            initial={animation.initial}
            animate={animation.animate}
            exit={animation.exit}
            className={cn(
              'fixed top-1/2 left-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-zinc-800',
              contentClassName,
              className
            )}
          >
            {/* 可访问性标题和描述 */}
            {title && (
              <VisuallyHidden.Root asChild>
                <Dialog.Title>{title}</Dialog.Title>
              </VisuallyHidden.Root>
            )}
            {description && (
              <VisuallyHidden.Root asChild>
                <Dialog.Description>{description}</Dialog.Description>
              </VisuallyHidden.Root>
            )}

            {/* 关闭按钮 */}
            {showCloseButton && (
              <Dialog.Close asChild>
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 z-10 rounded-sm p-1 text-zinc-400 transition-colors hover:text-zinc-600 focus:ring-2 focus:ring-zinc-500 focus:outline-none dark:hover:text-zinc-300 dark:focus:ring-zinc-400"
                  aria-label="关闭"
                >
                  <i className="i-mingcute-close-line h-5 w-5" />
                </button>
              </Dialog.Close>
            )}

            {/* 模态框内容 */}
            {children}
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/**
 * 模态框头部组件
 */
export function ModalHeader({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'border-b border-gray-200 px-6 py-4 dark:border-gray-700',
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * 模态框标题组件
 */
export function ModalTitle({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        'text-lg font-semibold text-gray-900 dark:text-gray-100',
        className
      )}
    >
      {children}
    </h2>
  );
}

/**
 * 模态框内容组件
 */
export function ModalContent({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn('px-6 py-4', className)}>{children}</div>;
}

/**
 * 模态框底部组件
 */
export function ModalFooter({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'border-t border-gray-200 px-6 py-4 dark:border-gray-700',
        className
      )}
    >
      {children}
    </div>
  );
}
