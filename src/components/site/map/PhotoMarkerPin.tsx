/**
 * 单照片标记组件 - 参考 afilmory 设计理念，原创实现
 * 特点：相机图标、照片背景、EXIF 信息、HoverCard 交互
 */
'use client';

import type { PhotoFile } from '@/lib/photos';
import * as HoverCard from '@radix-ui/react-hover-card';
import { Marker } from '@vis.gl/react-maplibre';
import { motion as m } from 'motion/react';
import Link from 'next/link';
import { Image } from '@/components/ui/image/Image';
import imageMetadata from '../../../../public/image-metadata.json';

interface PhotoMarkerPinProps {
  photo: PhotoFile;
  latitude: number;
  longitude: number;
  isSelected?: boolean;
  onClick?: () => void;
  onClose?: () => void;
}

export function PhotoMarkerPin({
  photo,
  latitude,
  longitude,
  isSelected = false,
  onClick,
  onClose,
}: PhotoMarkerPinProps) {
  const metadata = (imageMetadata as Record<string, any>)[photo.absUrl];

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.();
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose?.();
  };

  return (
    <Marker longitude={longitude} latitude={latitude}>
      <HoverCard.Root
        open={isSelected ? true : undefined}
        openDelay={isSelected ? 0 : 400}
        closeDelay={isSelected ? 0 : 100}
      >
        <HoverCard.Trigger asChild>
          <m.div
            className="group relative cursor-pointer"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 30,
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleClick}
          >
            {/* 选中状态脉冲环 */}
            {isSelected && (
              <div className="absolute inset-0 -m-2 animate-pulse rounded-full bg-blue-500/30" />
            )}

            {/* 照片背景预览 */}
            <div className="absolute inset-0 overflow-hidden rounded-full">
              <Image
                src={photo.absUrl}
                alt={photo.name}
                width={40}
                height={40}
                className="h-full w-full object-cover opacity-40"
              />
              {/* 渐变叠加 */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/60 to-emerald-600/80 dark:from-green-500/70 dark:to-emerald-600/90" />
            </div>

            {/* 主容器 */}
            <div
              className={`relative flex h-10 w-10 items-center justify-center rounded-full border shadow-lg backdrop-blur-md transition-all duration-300 hover:shadow-xl ${
                isSelected
                  ? 'border-blue-400/40 bg-blue-500/90 shadow-blue-500/50 dark:border-blue-300/30 dark:bg-blue-500/80'
                  : 'border-white/40 bg-white/95 hover:bg-white dark:border-white/20 dark:bg-black/80 dark:hover:bg-black/90'
              }`}
            >
              {/* 玻璃态叠加 */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-white/10 dark:from-white/20 dark:to-white/5" />

              {/* 相机图标 */}
              <i
                className={`i-ri-camera-line relative z-10 text-lg drop-shadow-sm ${
                  isSelected ? 'text-white' : 'text-gray-700 dark:text-white'
                }`}
              />

              {/* 内阴影 */}
              <div className="absolute inset-0 rounded-full shadow-inner shadow-black/5" />
            </div>
          </m.div>
        </HoverCard.Trigger>

        <HoverCard.Portal>
          <HoverCard.Content
            className={`z-50 w-80 overflow-hidden rounded-xl border border-white/20 bg-white/95 p-0 shadow-2xl backdrop-blur-[120px] dark:bg-black/95 ${
              isSelected ? 'shadow-2xl' : ''
            }`}
            side="top"
            align="center"
            sideOffset={12}
            onPointerDownOutside={isSelected ? (e) => e.preventDefault() : undefined}
            onEscapeKeyDown={isSelected ? (e) => e.preventDefault() : undefined}
          >
            <div className="relative">
              {/* 选中时显示关闭按钮 */}
              {isSelected && onClose && (
                <button
                  type="button"
                  onClick={handleClose}
                  className="absolute right-3 top-3 z-10 flex size-8 items-center justify-center rounded-lg border border-white/20 bg-white/80 backdrop-blur-md transition-all hover:bg-white dark:border-white/10 dark:bg-black/80 dark:hover:bg-black"
                >
                  <i className="i-ri-close-line text-lg" />
                </button>
              )}

              {/* 照片头部 */}
              <div className="relative h-32 overflow-hidden">
                <Image
                  src={photo.absUrl}
                  alt={photo.name}
                  width={320}
                  height={128}
                  className="h-full w-full object-cover"
                />
                {/* 渐变叠加 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>

              {/* 内容 */}
              <div className="space-y-3 p-4">
                {/* 标题 */}
                <Link
                  href={`/photos/${encodeURIComponent(photo.album)}/${encodeURIComponent(photo.name)}`}
                  target="_blank"
                  className="group/link flex items-center gap-2 transition-colors hover:text-blue-600"
                >
                  <h3 className="flex-1 truncate text-sm font-semibold text-gray-900 dark:text-gray-100" title={photo.name}>
                    {photo.name}
                  </h3>
                  <i className="i-ri-arrow-right-line text-gray-500 transition-transform group-hover/link:translate-x-0.5 dark:text-gray-400" />
                </Link>

                {/* 元数据 */}
                <div className="space-y-2">
                  {/* 相册 */}
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <i className="i-ri-folder-line text-sm" />
                    <span>{photo.album}</span>
                  </div>

                  {/* GPS 坐标 */}
                  <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <i className="i-ri-map-pin-line text-sm" />
                      <span className="font-mono">
                        {Math.abs(latitude).toFixed(4)}°N, {Math.abs(longitude).toFixed(4)}°E
                      </span>
                    </div>
                  </div>

                  {/* 图片尺寸 */}
                  {metadata && (
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <i className="i-ri-image-line text-sm" />
                      <span>
                        {metadata.width} × {metadata.height}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </HoverCard.Content>
        </HoverCard.Portal>
      </HoverCard.Root>
    </Marker>
  );
}
