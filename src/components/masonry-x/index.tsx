'use client';

import { useRef, useState, useEffect, useLayoutEffect } from 'react';

interface MasonryXProps<T> {
  items: T[];
  columnCount?: number;
  gap?: number;
  renderItem: (
    item: T,
    idx: number,
    onImgLoad: (height: number, src?: string) => void,
    width?: number,
    height?: number,
    loadedSrcs?: Set<string>
  ) => React.ReactNode;
  getItemHeight?: (item: T, idx: number) => number;
}

interface MasonryItemLayout {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function MasonryX<T>({
  items,
  columnCount = 3,
  gap = 16,
  renderItem,
  getItemHeight
}: MasonryXProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [itemHeights, setItemHeights] = useState<number[]>(
    Array(items.length).fill(300)
  );
  const [layouts, setLayouts] = useState<MasonryItemLayout[]>([]);
  const [containerWidth, setContainerWidth] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const [loadedSrcs, setLoadedSrcs] = useState<Set<string>>(() => new Set());

  // 获取容器宽度和窗口高度
  useLayoutEffect(() => {
    function update() {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
      setWindowHeight(window.innerHeight);
    }
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // 监听滚动
  useEffect(() => {
    function onScroll() {
      setScrollTop(window.scrollY);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 计算每个图片的布局
  useEffect(() => {
    if (!containerWidth) return;
    const colWidth = (containerWidth - gap * (columnCount - 1)) / columnCount;
    const colHeights = Array(columnCount).fill(0);
    const layouts: MasonryItemLayout[] = [];

    items.forEach((_, idx) => {
      const minCol = colHeights.indexOf(Math.min(...colHeights));
      const x = minCol * (colWidth + gap);
      const y = colHeights[minCol];
      layouts[idx] = {
        x,
        y,
        width: colWidth,
        height: itemHeights[idx]
      };
      colHeights[minCol] += itemHeights[idx] + gap;
    });

    setLayouts(layouts);
  }, [items, itemHeights, columnCount, containerWidth, gap]);

  useEffect(() => {
    if (getItemHeight) {
      setItemHeights(items.map((item, idx) => getItemHeight(item, idx)));
    } else {
      setItemHeights(Array(items.length).fill(300));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, getItemHeight]);

  // 容器高度 = 最高的那一列
  const containerHeight = layouts.length
    ? Math.max(...layouts.map((l) => l.y + l.height))
    : 0;

  // 图片加载后回调
  const handleImgLoad = (idx: number, h: number, src?: string) => {
    setItemHeights((prev) => {
      if (prev[idx] === h) return prev;
      const next = [...prev];
      next[idx] = h;
      return next;
    });
    if (src) {
      setLoadedSrcs((prev) => {
        if (prev.has(src)) return prev;
        const next = new Set(prev);
        next.add(src);
        return next;
      });
    }
  };

  // 虚拟滚动：只渲染可视区域的 items
  const buffer = 500; // 预加载 buffer
  const visibleItems = layouts
    .map((layout, idx) => ({ layout, idx }))
    .filter(
      ({ layout }) =>
        layout.y + layout.height > scrollTop - buffer &&
        layout.y < scrollTop + windowHeight + buffer
    );

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: containerHeight,
        minHeight: 100
      }}
    >
      {visibleItems.map(({ layout, idx }) => (
        <div
          key={typeof items[idx] === 'string' ? items[idx] : idx}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: layout?.width,
            height: layout?.height,
            transform: layout
              ? `translate(${layout.x}px, ${layout.y}px)`
              : undefined,
            transition: 'transform 0.3s, height 0.3s'
          }}
        >
          {renderItem(
            items[idx],
            idx,
            (h: number, src?: string) => handleImgLoad(idx, h, src),
            layout?.width,
            layout?.height,
            loadedSrcs
          )}
        </div>
      ))}
    </div>
  );
}
