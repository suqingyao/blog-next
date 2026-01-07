/**
 * 聚类标记组件 - 参考 afilmory 设计理念，原创实现
 * 特点：照片马赛克预览、动态大小、HoverCard 照片网格
 */
'use client';

import type { PhotoFile } from '@/lib/photos';
import * as HoverCard from '@radix-ui/react-hover-card';
import { Marker } from '@vis.gl/react-maplibre';
import { motion as m } from 'motion/react';
import { Image } from '@/components/ui/image/Image';

interface ClusterMarkerProps {
  longitude: number;
  latitude: number;
  count: number;
  photos: PhotoFile[];
  onClick?: () => void;
}

export function ClusterMarker({
  longitude,
  latitude,
  count,
  photos,
  onClick,
}: ClusterMarkerProps) {
  // 动态计算大小 - 参考 afilmory 算法
  const size = Math.min(64, Math.max(40, 32 + Math.log(count) * 8));

  return (
    <Marker longitude={longitude} latitude={latitude}>
      <HoverCard.Root openDelay={300} closeDelay={150}>
        <HoverCard.Trigger asChild>
          <m.div
            className="group relative cursor-pointer"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25,
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
          >
            {/* 脉冲环 */}
            <div
              className="absolute inset-0 animate-pulse rounded-full bg-blue-500/20 opacity-60"
              style={{
                width: size + 12,
                height: size + 12,
                left: -6,
                top: -6,
              }}
            />

            {/* 主容器 */}
            <div
              className="relative flex items-center justify-center rounded-full border border-white/40 bg-white/95 shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-white hover:shadow-xl dark:border-white/10 dark:bg-black/80 dark:hover:bg-black/90"
              style={{
                width: size,
                height: size,
              }}
            >
              {/* 照片马赛克背景 (最多4张) */}
              {photos.length > 0 && (
                <div className="absolute inset-1 overflow-hidden rounded-full">
                  {photos.slice(0, 4).map((photo, index) => {
                    const positions = [
                      { left: '0%', top: '0%', width: '50%', height: '50%' },
                      { left: '50%', top: '0%', width: '50%', height: '50%' },
                      { left: '0%', top: '50%', width: '50%', height: '50%' },
                      { left: '50%', top: '50%', width: '50%', height: '50%' },
                    ];
                    const position = positions[index];

                    return (
                      <div
                        key={photo.absUrl}
                        className="absolute opacity-30"
                        style={position}
                      >
                        <Image
                          src={photo.absUrl}
                          alt={photo.name}
                          width={size / 2}
                          height={size / 2}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    );
                  })}

                  {/* 渐变叠加 */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/40 to-indigo-600/60" />
                </div>
              )}

              {/* 玻璃态叠加 */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-white/10 dark:from-white/20 dark:to-white/5" />

              {/* 数字显示 */}
              <div className="relative z-10 flex flex-col items-center text-xs">
                <span className="font-bold text-gray-900 dark:text-white">{count}</span>
              </div>

              {/* 内阴影 */}
              <div className="absolute inset-0 rounded-full shadow-inner shadow-black/5" />
            </div>
          </m.div>
        </HoverCard.Trigger>

        <HoverCard.Portal>
          <HoverCard.Content
            className="z-50 w-80 overflow-hidden rounded-xl border border-white/20 bg-white/95 p-0 shadow-2xl backdrop-blur-[120px] dark:bg-black/95"
            side="top"
            align="center"
            sideOffset={8}
          >
            <div className="p-4">
              {/* 标题 */}
              <div className="mb-3 flex items-center gap-2 rounded-lg bg-purple-100 px-3 py-1.5 dark:bg-purple-900/30">
                <i className="i-ri-image-line text-purple-600 dark:text-purple-400" />
                <span className="text-xs font-medium text-purple-700 dark:text-purple-300">
                  此位置有 {count} 张照片
                </span>
              </div>

              {/* 照片网格 */}
              <div className="grid grid-cols-3 gap-2">
                {photos.slice(0, 6).map((photo) => (
                  <div
                    key={photo.absUrl}
                    className="group relative aspect-square overflow-hidden rounded-lg"
                  >
                    <Image
                      src={photo.absUrl}
                      alt={photo.name}
                      width={100}
                      height={100}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    {/* 悬停叠加 */}
                    <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
                  </div>
                ))}
              </div>

              {/* 更多提示 */}
              {count > 6 && (
                <p className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
                  还有 {count - 6} 张照片...
                </p>
              )}

              {/* 提示文字 */}
              <p className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
                点击标记放大查看更多
              </p>
            </div>
          </HoverCard.Content>
        </HoverCard.Portal>
      </HoverCard.Root>
    </Marker>
  );
}
