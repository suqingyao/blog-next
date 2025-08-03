'use client';

import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { motion } from 'motion/react';

const useMedia = (
  queries: string[],
  values: number[],
  defaultValue: number
): number => {
  const get = () => {
    if (typeof window === 'undefined') return defaultValue;
    return (
      values[queries.findIndex((q) => window.matchMedia(q).matches)] ??
      defaultValue
    );
  };

  const [value, setValue] = useState<number>(get);

  useEffect(() => {
    const handler = () => setValue(get);
    queries.forEach((q) =>
      window.matchMedia(q).addEventListener('change', handler)
    );
    return () =>
      queries.forEach((q) =>
        window.matchMedia(q).removeEventListener('change', handler)
      );
  }, [queries]);

  return value;
};

const useMeasure = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  return [ref, size] as const;
};

const preloadImages = async (urls: string[]): Promise<void> => {
  await Promise.all(
    urls.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new window.Image();
          img.src = src;
          img.onload = img.onerror = () => resolve();
        })
    )
  );
};

export interface Item {
  id: string;
  img: string;
  url: string;
  height?: number; // 可选
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
  onItemClick
}) => {
  const columns = useMedia(
    [
      '(min-width:1500px)',
      '(min-width:1000px)',
      '(min-width:600px)',
      '(min-width:400px)'
    ],
    [5, 4, 3, 2],
    1
  );

  const [containerRef, { width }] = useMeasure<HTMLDivElement>();
  const [imagesReady, setImagesReady] = useState(false);
  const [itemHeights, setItemHeights] = useState<number[]>(
    items.map((item) => item.height ?? 300)
  );

  // 图片加载后测量高度
  const handleImgLoad = (
    idx: number,
    e: React.SyntheticEvent<HTMLImageElement>
  ) => {
    if (items[idx].height) return; // 已有高度无需测量
    const img = e.currentTarget as HTMLImageElement;
    const aspect = img.naturalHeight / img.naturalWidth;
    const w = grid[idx]?.w || img.width;
    const h = w * aspect;
    setItemHeights((prev) => {
      if (prev[idx] === h) return prev;
      const next = [...prev];
      next[idx] = h;
      return next;
    });
  };

  useEffect(() => {
    preloadImages(items.map((i) => i.img)).then(() => setImagesReady(true));
  }, [items]);

  // Masonry 布局
  const grid = useMemo(() => {
    if (!width) return [];
    const colHeights = new Array(columns).fill(0);
    const totalGaps = (columns - 1) * gap;
    const columnWidth = (width - totalGaps) / columns;

    return items.map((child, idx) => {
      const col = colHeights.indexOf(Math.min(...colHeights));
      const x = col * (columnWidth + gap);
      const height = itemHeights[idx] ?? 0;
      const y = colHeights[col];
      colHeights[col] += height + gap;
      return { ...child, x, y, w: columnWidth, h: height };
    });
  }, [columns, items, width, itemHeights, gap]);

  // 容器高度 = 最高的那一列
  const containerHeight = grid.length
    ? Math.max(...grid.map((l) => l.y + l.h))
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
        layout.y + layout.h > scrollTop - buffer &&
        layout.y < scrollTop + windowHeight + buffer
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
            height: layout.h
          }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          className="absolute box-content overflow-hidden rounded-xs"
          style={{
            left: 0,
            top: 0,
            width: layout.w,
            height: layout.h,
            willChange: 'transform, width, height, opacity',
            overflow: 'hidden'
          }}
        >
          <motion.div
            className="relative h-full w-full cursor-pointer rounded-xs bg-cover bg-center shadow-[0px_10px_50px_-10px_rgba(0,0,0,0.2)]"
            style={{
              backgroundImage: `url(${items[idx].img})`,
              willChange: 'transform'
            }}
            whileHover={scaleOnHover ? { scale: hoverScale } : undefined}
            transition={{
              type: 'tween',
              duration: 0.2,
              ease: 'easeOut'
            }}
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              e.stopPropagation();
              if (onItemClick) {
                onItemClick(items[idx], e);
              }
            }}
          >
            <img
              src={items[idx].url}
              alt={items[idx].id}
              className="h-full w-full object-cover"
              onLoad={(e) => handleImgLoad(idx, e)}
              draggable={false}
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
