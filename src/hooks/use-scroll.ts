import { atom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useMemo, useRef, useState } from 'react';

// 滚动位置和方向的全局状态
const scrollYAtom = atom(0);
const scrollDirectionAtom = atom<'up' | 'down' | null>(null);

// 监听滚动并更新状态（监听容器元素）
export function useScrollListener(containerRef: React.RefObject<HTMLElement | null>) {
  const setScrollY = useSetAtom(scrollYAtom);
  const setScrollDirection = useSetAtom(scrollDirectionAtom);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      console.log('[useScrollListener] 容器未找到');
      return;
    }

    console.log('[useScrollListener] 开始监听滚动:', container);

    let rafId: number | null = null;
    let lastScrollY = container.scrollTop;

    const handleScroll = () => {
      if (rafId !== null) return;

      rafId = requestAnimationFrame(() => {
        const currentScrollY = container.scrollTop;
        const direction = currentScrollY > lastScrollY ? 'down' : currentScrollY < lastScrollY ? 'up' : null;

        if (direction) {
          console.log('[Scroll]', { 
            scrollY: currentScrollY, 
            direction,
            lastScrollY,
            diff: currentScrollY - lastScrollY
          });

          setScrollY(currentScrollY);
          setScrollDirection(direction);
        }

        lastScrollY = currentScrollY;
        rafId = null;
      });
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    
    // 初始化
    handleScroll();

    return () => {
      console.log('[useScrollListener] 停止监听');
      container.removeEventListener('scroll', handleScroll);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [setScrollY, setScrollDirection]);
}

// 获取滚动位置
export function useScrollY() {
  return useAtomValue(scrollYAtom);
}

// 获取滚动方向
export function useScrollDirection() {
  return useAtomValue(scrollDirectionAtom);
}

// 计算 Header 背景透明度
export function useHeaderBgOpacity() {
  const scrollY = useScrollY();
  
  // 滚动阈值：开始显示背景的位置
  const threshold = 100;
  // 过渡距离：从透明到不透明的距离
  const distance = 50;

  return useMemo(() => {
    if (scrollY < threshold) return 0;
    if (scrollY >= threshold + distance) return 1;
    
    // 线性插值
    return (scrollY - threshold) / distance;
  }, [scrollY]);
}

// 计算导航菜单透明度
// 逻辑：顶部始终显示(1)，向下滚动时不影响，因为我们用 Header 的 translateY 来控制显示/隐藏
export function useMenuOpacity() {
  const scrollY = useScrollY();
  
  return useMemo(() => {
    // 顶部区域：完全显示
    if (scrollY < 100) return 1;
    
    // 其他区域：保持显示（因为 Header 整体的显示/隐藏由 useHeaderVisible 控制）
    return 1;
  }, [scrollY]);
}

// 检测是否向上滚动且超过阈值
export function useIsScrollUpAndOver(threshold: number) {
  const scrollY = useScrollY();
  const direction = useScrollDirection();
  
  return useMemo(() => {
    return scrollY > threshold && direction === 'up';
  }, [scrollY, direction, threshold]);
}

// 判断 Header 是否应该显示（带防抖）
export function useHeaderVisible() {
  const scrollY = useScrollY();
  const direction = useScrollDirection();
  const [debouncedVisible, setDebouncedVisible] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 清除之前的定时器
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // 计算新状态
    let shouldShow = true;

    // 顶部始终显示
    if (scrollY < 100) {
      shouldShow = true;
      console.log('[useHeaderVisible] 顶部区域，显示');
    }
    // 向上滚动时显示
    else if (direction === 'up') {
      shouldShow = true;
      console.log('[useHeaderVisible] 向上滚动，显示');
    }
    // 向下滚动时隐藏
    else if (direction === 'down') {
      shouldShow = false;
      console.log('[useHeaderVisible] 向下滚动，隐藏');
    }

    // 防抖：延迟更新状态
    timeoutRef.current = setTimeout(() => {
      setDebouncedVisible(shouldShow);
    }, 50); // 50ms 防抖

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [scrollY, direction]);

  return debouncedVisible;
}
