'use client';

import { motion } from 'motion/react';
import React, { useMemo } from 'react';
import { Image } from '@/components/ui/image/Image';
import imageMetadata from '../../../public/image-metadata.json';

interface PhotoCardProps {
  photo: {
    id: string;
    url: string;
    img: string;
    width?: number;
    height?: number;
    blurDataURL?: string;
    blurhash?: string;
  };
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
}

// Format EXIF data for display
function formatExif(exif: any) {
  if (!exif)
    return null;

  const parts = [];

  if (exif.FocalLengthIn35mmFormat) {
    parts.push(`${exif.FocalLengthIn35mmFormat}mm`);
  }
  else if (exif.FocalLength) {
    parts.push(`${exif.FocalLength}mm`);
  }

  if (exif.FNumber) {
    parts.push(`f/${exif.FNumber}`);
  }

  if (exif.ExposureTime) {
    if (exif.ExposureTime < 1) {
      parts.push(`1/${Math.round(1 / exif.ExposureTime)}s`);
    }
    else {
      parts.push(`${exif.ExposureTime}s`);
    }
  }

  if (exif.ISO) {
    parts.push(`ISO${exif.ISO}`);
  }

  return parts;
}

function formatDate(dateString: string) {
  if (!dateString)
    return null;
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function PhotoCard({ photo, onClick, className }: PhotoCardProps) {
  const metadata = (imageMetadata as Record<string, any>)[photo.url];
  const exifData = useMemo(() => formatExif(metadata?.exif), [metadata]);
  const dateTaken = useMemo(() => formatDate(metadata?.exif?.DateTimeOriginal), [metadata]);
  const cameraModel = metadata?.exif?.Model;

  return (
    <motion.div
      className={`group relative w-full cursor-pointer overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900 ${className}`}
      onClick={onClick}
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="relative aspect-[var(--aspect-ratio)] w-full overflow-hidden" style={{ '--aspect-ratio': `${(photo.width || 1) / (photo.height || 1)}` } as React.CSSProperties}>
        <Image
          src={photo.url}
          alt={photo.id}
          width={photo.width}
          height={photo.height}
          blurhash={photo.blurhash || metadata?.blurhash}
          blurDataURL={photo.blurDataURL || metadata?.blurDataURL}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Metadata Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex flex-col gap-1 text-white">
            {cameraModel && (
              <div className="flex items-center gap-2 text-xs font-medium text-white/90">
                <i className="i-mingcute-camera-line" />
                <span>{cameraModel}</span>
              </div>
            )}

            {exifData && exifData.length > 0 && (
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-white/70">
                {exifData.map((item, i) => (
                  <span key={i} className="flex items-center gap-1">
                    {i === 0 && <i className="i-mingcute-lens-line" />}
                    {item}
                  </span>
                ))}
              </div>
            )}

            {dateTaken && (
              <div className="mt-1 flex items-center gap-2 text-[10px] text-white/50">
                <i className="i-mingcute-calendar-line" />
                <span>{dateTaken}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
