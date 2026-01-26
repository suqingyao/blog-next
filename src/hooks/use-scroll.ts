import { atom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useRef } from 'react';

// 滚动位置和方向的全局状态
const scrollYAtom = atom(0);
const scrollDirectionAtom = atom<'up' | 'down' | null>(null);

// 监听滚动并更新状态（监听容器元素）
export function useScrollListener(containerRef: React.RefObject<HTMLElement | null>) {
  const setScrollY = useSetAtom(scrollYAtom);
  const setScrollDirection = useSetAtom(scrollDirectionAtom);
  const rafIdRef = useRef<number | null>(null);
  const lastScrollYRef = useRef(0);

  // Use useEffect to handle scroll events with RAF throttling
  useEffect(() => {
    const container = containerRef.current;
    if (!container)
      return;

    const handleScroll = () => {
      if (rafIdRef.current !== null)
        return;

      rafIdRef.current = requestAnimationFrame(() => {
        const currentScrollY = container.scrollTop;
        const direction = currentScrollY > lastScrollYRef.current
          ? 'down'
          : currentScrollY < lastScrollYRef.current
            ? 'up'
            : null;

        if (direction) {
          setScrollY(currentScrollY);
          setScrollDirection(direction);
        }

        lastScrollYRef.current = currentScrollY;
        rafIdRef.current = null;
      });
    };

    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
    // containerRef is intentionally not in deps - ref objects don't trigger re-renders
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Simple calculation, no need for useMemo
  if (scrollY < threshold)
    return 0;
  if (scrollY >= threshold + distance)
    return 1;

  // 线性插值
  return (scrollY - threshold) / distance;
}

// 计算导航菜单透明度
// 逻辑：顶部始终显示(1)，向下滚动时不影响，因为我们用 Header 的 translateY 来控制显示/隐藏
export function useMenuOpacity() {
  const scrollY = useScrollY();

  // Simple calculation, always returns 1 or based on threshold
  return scrollY < 100 ? 1 : 1;
}

// 检测是否向上滚动且超过阈值
export function useIsScrollUpAndOver(threshold: number) {
  const scrollY = useScrollY();
  const direction = useScrollDirection();

  // Simple boolean check, no need for useMemo
  return scrollY > threshold && direction === 'up';
}

// 判断 Header 是否应该显示
// 优化：移除防抖，直接返回计算结果
// RAF 已经提供了足够的节流（~16.7ms @ 60fps），不需要额外延迟
// 滚动场景需要实时响应，防抖会导致延迟和卡顿感
export function useHeaderVisible() {
  const scrollY = useScrollY();
  const direction = useScrollDirection();

  // 直接返回，响应更快，体验更流畅
  return scrollY < 100 || direction === 'up';
}
