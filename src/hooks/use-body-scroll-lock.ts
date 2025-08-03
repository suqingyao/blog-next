import { useEffect, useRef } from 'react';

/**
 * 自定义Hook：管理body滚动锁定
 * 使用data属性和直接样式操作，避免水合错误
 * @param isLocked - 是否锁定滚动
 */
export function useBodyScrollLock(isLocked: boolean) {
  const originalStylesRef = useRef<{
    overflow: string;
    position: string;
    top: string;
    width: string;
  } | null>(null);
  const scrollPositionRef = useRef<number>(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const body = document.body;

    if (isLocked) {
      // 保存原始样式
      originalStylesRef.current = {
        overflow: body.style.overflow || '',
        position: body.style.position || '',
        top: body.style.top || '',
        width: body.style.width || ''
      };

      // 保存当前滚动位置
      scrollPositionRef.current = window.scrollY;

      // 设置data属性用于CSS选择器
      body.setAttribute('data-scroll-locked', 'true');

      // 直接设置样式 - 只隐藏滚动条，不改变定位
      body.style.overflow = 'hidden';
      body.style.width = '100%';
    } else {
      // 移除data属性
      body.removeAttribute('data-scroll-locked');

      // 恢复原始样式
      if (originalStylesRef.current) {
        body.style.overflow = originalStylesRef.current.overflow;
        body.style.width = originalStylesRef.current.width;
      }

      if (scrollPositionRef.current > 0) {
        window.scrollTo({
          top: scrollPositionRef.current,
          behavior: 'instant' // 使用 instant 避免动画冲突
        });
      }
    }

    return () => {
      if (isLocked) {
        body.removeAttribute('data-scroll-locked');

        if (originalStylesRef.current) {
          body.style.overflow = originalStylesRef.current.overflow;
          body.style.width = originalStylesRef.current.width;
        }

        // 清理时也恢复滚动位置
        if (scrollPositionRef.current > 0) {
          window.scrollTo({
            top: scrollPositionRef.current,
            behavior: 'instant'
          });
        }
      }
    };
  }, [isLocked]);
}
