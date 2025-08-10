import { useEffect, useState } from 'react';

/**
 * 自定义Hook：安全获取滚动位置
 * 避免服务端和客户端渲染不一致导致的水合错误
 * @returns scrollY - 当前滚动位置
 */
export function useScrollPosition() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // 只在客户端执行
    if (typeof window === 'undefined')
      return;

    // 初始化滚动位置
    setScrollY(window.scrollY);

    // 监听滚动事件（可选，如果需要实时更新）
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return scrollY;
}

/**
 * 获取初始滚动位置的Hook
 * 只在组件挂载时获取一次，避免频繁更新
 * @returns { initialScrollX, initialScrollY } - 组件挂载时的滚动位置
 */
export function useInitialScrollPosition() {
  const [initialScrollX, setInitialScrollX] = useState(0);
  const [initialScrollY, setInitialScrollY] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setInitialScrollX(window.scrollX);
      setInitialScrollY(window.scrollY);
    }
  }, []);

  return { initialScrollX, initialScrollY };
}
