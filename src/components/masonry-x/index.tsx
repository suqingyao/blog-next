'use client';

import { useRef, useState, useEffect, useLayoutEffect } from 'react';

interface MasonryXProps<T> {
  items: T[];
  columnCount?: number;
  gap?: number;
  renderItem: (
    item: T,
    idx: number,
    onImgLoad: (height: number) => void
  ) => React.ReactNode;
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
  renderItem
}: MasonryXProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [itemHeights, setItemHeights] = useState<number[]>(
    Array(items.length).fill(300)
  );
  const [layouts, setLayouts] = useState<MasonryItemLayout[]>([]);
  const [containerWidth, setContainerWidth] = useState(0);

  // 获取容器宽度
  useLayoutEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth);
    }
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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

  // 容器高度 = 最高的那一列
  const containerHeight = layouts.length
    ? Math.max(...layouts.map((l) => l.y + l.height))
    : 0;

  // 图片加载后回调
  const handleImgLoad = (idx: number, h: number) => {
    setItemHeights((prev) => {
      if (prev[idx] === h) return prev;
      const next = [...prev];
      next[idx] = h;
      return next;
    });
  };

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
      {items.map((item, idx) => {
        const layout = layouts[idx];
        return (
          <div
            key={typeof item === 'string' ? item : idx}
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
            {renderItem(item, idx, (h) => handleImgLoad(idx, h))}
          </div>
        );
      })}
    </div>
  );
}
