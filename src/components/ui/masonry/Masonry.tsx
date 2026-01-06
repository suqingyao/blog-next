'use client';

import { motion } from 'motion/react';
import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Image } from '@/components/ui/image/Image';

function useMedia(queries: string[], values: number[], defaultValue: number): number {
  const get = () => {
    if (typeof window === 'undefined')
      return defaultValue;
    return (
      values[queries.findIndex(q => window.matchMedia(q).matches)]
      ?? defaultValue
    );
  };

  const [value, setValue] = useState<number>(get);

  useEffect(() => {
    const handler = () => setValue(get);
    queries.forEach(q =>
      window.matchMedia(q).addEventListener('change', handler),
    );
    return () =>
      queries.forEach(q =>
        window.matchMedia(q).removeEventListener('change', handler),
      );
  }, [queries]);

  return value;
}

function useMeasure<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!ref.current)
      return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  return [ref, size] as const;
}

export interface Item {
  id: string;
  img: string;
  url: string;
  width?: number;
  height?: number;
  blurDataURL?: string;
}

interface MasonryProps {
  items: Item[];
  scaleOnHover?: boolean;
  hoverScale?: number;
  colorShiftOnHover?: boolean;
  gap?: number; // 瀑布流间距，默认为 5
  onItemClick?: (item: Item, e: React.MouseEvent) => void;
}

export const Masonry: React.FC<MasonryProps> = ({
  items,
  scaleOnHover = true,
  hoverScale = 1.1,
  colorShiftOnHover = false,
  gap = 5,
  onItemClick,
}) => {
  const columns = useMedia(
    [
      '(min-width:1500px)',
      '(min-width:1000px)',
      '(min-width:600px)',
      '(min-width:400px)',
    ],
    [5, 4, 3, 2],
    1,
  );

  const [containerRef, { width }] = useMeasure<HTMLDivElement>();
  // 仅作为后备，如果 item 中没有宽高，则在加载后更新
  const [dynamicHeights, setItemHeights] = useState<Record<string, number>>({});

  // 图片加载后测量高度（仅当元数据缺失时需要）
  const handleImgLoad = (
    idx: number,
    e: React.SyntheticEvent<HTMLImageElement>,
  ) => {
    const item = items[idx];
    if (item.width && item.height)
      return; // 已有高度无需测量

    const img = e.currentTarget as HTMLImageElement;
    const aspect = img.naturalHeight / img.naturalWidth;
    // 这里的 w 是估算的列宽，并不精确，但在后续计算 grid 时会修正
    // 关键是保存 aspect ratio 或者直接保存计算出的 height
    // 为了简单，我们只在没有元数据时触发重绘
    setItemHeights((prev) => {
      // 存储宽高比，而不是具体高度，因为宽度可能会变
      return { ...prev, [item.id]: aspect };
    });
  };

  // Masonry 布局
  const grid = useMemo(() => {
    if (!width)
      return [];
    const colHeights = Array.from({ length: columns }, () => 0);
    const totalGaps = (columns - 1) * gap;
    const columnWidth = (width - totalGaps) / columns;

    return items.map((child) => {
      const col = colHeights.indexOf(Math.min(...colHeights));
      const x = col * (columnWidth + gap);

      let height = 300; // 默认高度

      // 优先使用元数据中的宽高
      if (child.width && child.height) {
        height = (child.height / child.width) * columnWidth;
      }
      else if (dynamicHeights[child.id]) {
        // 使用动态加载后计算的宽高比
        height = dynamicHeights[child.id] * columnWidth;
      }
      else if (child.height) {
        // 兼容旧的 height 属性（直接指定高度）
        height = child.height;
      }

      const y = colHeights[col];
      colHeights[col] += height + gap;
      return { ...child, x, y, w: columnWidth, h: height };
    });
  }, [columns, items, width, dynamicHeights, gap]);

  // 容器高度 = 最高的那一列
  const containerHeight = grid.length
    ? Math.max(...grid.map(l => l.y + l.h))
    : 0;

  // 虚拟滚动
  const [scrollTop, setScrollTop] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  useEffect(() => {
    function onScroll() {
      setScrollTop(window.scrollY);
    }
    function onResize() {
      setWindowHeight(window.innerHeight);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    onResize();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const buffer = 500;
  const visibleItems = grid
    .map((layout, idx) => ({ layout, idx }))
    .filter(
      ({ layout }) =>
        layout.y + layout.h > scrollTop - buffer
        && layout.y < scrollTop + windowHeight + buffer,
    );

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full"
      style={{ height: containerHeight }}
    >
      {visibleItems.map(({ layout, idx }) => (
        <motion.div
          key={items[idx].id}
          data-key={items[idx].id}
          initial={{ opacity: 0, x: layout.x, y: layout.y }}
          animate={{
            opacity: 1,
            x: layout.x,
            y: layout.y,
            width: layout.w,
            height: layout.h,
          }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          className="absolute box-content overflow-hidden rounded-xs"
          style={{
            left: 0,
            top: 0,
            width: layout.w,
            height: layout.h,
            willChange: 'transform, width, height, opacity',
            overflow: 'hidden',
          }}
        >
          <motion.div
            className="relative h-full w-full cursor-pointer rounded-xs shadow-[0px_10px_50px_-10px_rgba(0,0,0,0.2)]"
            whileHover={scaleOnHover ? { scale: hoverScale } : undefined}
            transition={{
              type: 'tween',
              duration: 0.2,
              ease: 'easeOut',
            }}
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              e.stopPropagation();
              if (onItemClick) {
                onItemClick(items[idx], e);
              }
            }}
          >
            <Image
              src={items[idx].url}
              alt={items[idx].id}
              width={items[idx].width || 500}
              height={items[idx].height || 500}
              blurDataURL={items[idx].blurDataURL}
              placeholder={items[idx].blurDataURL ? 'blur' : 'empty'}
              className="h-full w-full object-cover"
              onLoad={(e: React.SyntheticEvent<HTMLImageElement>) => handleImgLoad(idx, e)}
              draggable={false}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
            {colorShiftOnHover && (
              <motion.div
                className="color-overlay pointer-events-none absolute inset-0 rounded-[10px] bg-gradient-to-tr from-pink-500/50 to-sky-500/50"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.3 }}
                animate={{ opacity: 0 }}
              />
            )}
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};
