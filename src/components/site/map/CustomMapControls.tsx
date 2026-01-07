/**
 * 自定义地图控制组件 - 参考 afilmory 设计理念，原创实现
 * 特点：左下角位置、玻璃态设计、useMap hook 集成
 */
'use client';

import type { MapRef } from '@vis.gl/react-maplibre';
import { motion as m } from 'motion/react';

interface CustomMapControlsProps {
  mapRef: React.RefObject<MapRef | null>;
  onGeolocate?: (longitude: number, latitude: number) => void;
}

export function CustomMapControls({ mapRef, onGeolocate }: CustomMapControlsProps) {
  const handleZoomIn = () => {
    const map = mapRef.current?.getMap();
    if (map) {
      const currentZoom = map.getZoom();
      map.easeTo({ zoom: currentZoom + 1, duration: 300 });
    }
  };

  const handleZoomOut = () => {
    const map = mapRef.current?.getMap();
    if (map) {
      const currentZoom = map.getZoom();
      map.easeTo({ zoom: currentZoom - 1, duration: 300 });
    }
  };

  const handleCompass = () => {
    const map = mapRef.current?.getMap();
    if (map) {
      map.easeTo({ bearing: 0, pitch: 0, duration: 500 });
    }
  };

  const handleGeolocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          const map = mapRef.current?.getMap();
          if (map) {
            map.flyTo({
              center: [longitude, latitude],
              zoom: 14,
              duration: 1000,
            });
          }
          onGeolocate?.(longitude, latitude);
        },
        (error) => {
          console.warn('Geolocation error:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        },
      );
    }
  };

  return (
    <m.div
      className="absolute bottom-4 left-4 z-40 flex flex-col gap-3"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      {/* 缩放控制组 */}
      <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-200/50 bg-white/80 shadow-2xl backdrop-blur-[120px] dark:border-gray-700/50 dark:bg-black/80">
        {/* 放大 */}
        <button
          type="button"
          onClick={handleZoomIn}
          className="group flex h-12 w-12 items-center justify-center transition-colors hover:bg-gray-100/80 active:bg-gray-200/80 dark:hover:bg-gray-800/80 dark:active:bg-gray-700/80"
          title="放大"
        >
          <i className="i-ri-add-line size-5 text-gray-700 transition-transform group-hover:scale-110 group-active:scale-95 dark:text-gray-300" />
        </button>

        {/* 分隔线 */}
        <div className="h-px w-full bg-gray-200 dark:bg-gray-700" />

        {/* 缩小 */}
        <button
          type="button"
          onClick={handleZoomOut}
          className="group flex h-12 w-12 items-center justify-center transition-colors hover:bg-gray-100/80 active:bg-gray-200/80 dark:hover:bg-gray-800/80 dark:active:bg-gray-700/80"
          title="缩小"
        >
          <i className="i-ri-subtract-line size-5 text-gray-700 transition-transform group-hover:scale-110 group-active:scale-95 dark:text-gray-300" />
        </button>
      </div>

      {/* 指南针 */}
      <div className="overflow-hidden rounded-2xl border border-gray-200/50 bg-white/80 shadow-2xl backdrop-blur-[120px] dark:border-gray-700/50 dark:bg-black/80">
        <button
          type="button"
          onClick={handleCompass}
          className="group flex h-12 w-12 items-center justify-center transition-colors hover:bg-gray-100/80 active:bg-gray-200/80 dark:hover:bg-gray-800/80 dark:active:bg-gray-700/80"
          title="重置方向"
        >
          <i className="i-ri-compass-3-line size-5 text-gray-700 transition-transform group-hover:scale-110 group-active:scale-95 dark:text-gray-300" />
        </button>
      </div>

      {/* 定位 */}
      <div className="overflow-hidden rounded-2xl border border-gray-200/50 bg-white/80 shadow-2xl backdrop-blur-[120px] dark:border-gray-700/50 dark:bg-black/80">
        <button
          type="button"
          onClick={handleGeolocate}
          className="group flex h-12 w-12 items-center justify-center transition-colors hover:bg-gray-100/80 active:bg-gray-200/80 dark:hover:bg-gray-800/80 dark:active:bg-gray-700/80"
          title="定位到我的位置"
        >
          <i className="i-ri-map-pin-user-fill size-5 text-gray-700 transition-transform group-hover:scale-110 group-active:scale-95 dark:text-gray-300" />
        </button>
      </div>
    </m.div>
  );
}
