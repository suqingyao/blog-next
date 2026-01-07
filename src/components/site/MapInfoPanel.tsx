'use client';

import { motion as m } from 'motion/react';
import { useState } from 'react';

interface MapInfoPanelProps {
  markersCount: number;
  bounds?: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  } | null;
}

export function MapInfoPanel({ markersCount, bounds }: MapInfoPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <m.div
      className="absolute top-4 right-4 z-[1000] max-w-xs"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <div className="rounded-2xl border border-zinc-200 bg-white/80 shadow-2xl backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/80">
        {/* Header Section */}
        <div className="p-5">
          <m.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            {/* Icon container */}
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20 ring-inset">
              <i className="i-ri-map-2-line text-lg text-primary" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold leading-tight tracking-tight">
                  地图浏览
                </h1>
                {/* Collapse/Expand Button */}
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="relative -top-2 -mb-2 flex size-8 flex-shrink-0 items-center justify-center rounded-xl bg-zinc-100/50 ring-1 ring-zinc-200/20 ring-inset transition-all duration-200 hover:bg-zinc-200/50 dark:bg-zinc-800/50 dark:ring-zinc-700/20 dark:hover:bg-zinc-700/50"
                  aria-label={isExpanded ? '收起' : '展开'}
                >
                  <m.i
                    className="i-ri-arrow-down-s-line text-base text-zinc-600 dark:text-zinc-400"
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  />
                </button>
              </div>
              <div className="mt-1.5 flex items-center gap-2">
                <div className="flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-1 ring-1 ring-green-500/20 ring-inset">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                    找到 {markersCount} 个位置
                  </span>
                </div>
              </div>
            </div>
          </m.div>
        </div>

        {/* Coordinates Section - Collapsible */}
        <m.div
          initial={false}
          animate={{
            height: isExpanded && bounds ? 'auto' : 0,
            opacity: isExpanded && bounds ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          {bounds && (
            <div className="border-t border-zinc-200 px-5 pb-5 pt-4 dark:border-zinc-800">
              {/* Section header */}
              <div className="mb-4 flex items-center gap-2.5">
                <i className="i-ri-map-pin-line text-zinc-600 dark:text-zinc-400" />
                <span className="text-sm font-medium tracking-tight">
                  拍摄范围
                </span>
              </div>

              {/* Coordinate cards */}
              <div className="space-y-3">
                {/* Min coordinates */}
                <div className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
                  <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
                    <i className="i-ri-arrow-left-down-line text-sm" />
                    西南角
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">纬度</span>
                      <span className="font-mono text-sm tabular-nums">
                        {bounds.minLat.toFixed(6)}°
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">经度</span>
                      <span className="font-mono text-sm tabular-nums">
                        {bounds.minLng.toFixed(6)}°
                      </span>
                    </div>
                  </div>
                </div>

                {/* Max coordinates */}
                <div className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
                  <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
                    <i className="i-ri-arrow-right-up-line text-sm" />
                    东北角
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">纬度</span>
                      <span className="font-mono text-sm tabular-nums">
                        {bounds.maxLat.toFixed(6)}°
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">经度</span>
                      <span className="font-mono text-sm tabular-nums">
                        {bounds.maxLng.toFixed(6)}°
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Coverage area calculation */}
              <div className="mt-4 rounded-xl bg-zinc-100/50 p-3 dark:bg-zinc-800/30">
                <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                  <i className="i-ri-shape-line" />
                  <span className="font-medium">
                    覆盖范围: 约{' '}
                    {Math.abs(
                      (bounds.maxLat - bounds.minLat) *
                        (bounds.maxLng - bounds.minLng) *
                        111 *
                        111,
                    ).toFixed(1)}{' '}
                    平方公里
                  </span>
                </div>
              </div>
            </div>
          )}
        </m.div>
      </div>
    </m.div>
  );
}
