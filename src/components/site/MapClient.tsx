'use client';

import { motion as m } from 'motion/react';
import dynamic from 'next/dynamic';
import { usePhotos } from '@/providers/photos-provider';

const MapLibreMap = dynamic(() => import('./MapLibreMap'), {
  ssr: false,
  loading: () => <MapLoadingState />,
});

export function MapClient() {
  const photos = usePhotos();

  if (photos.length === 0) {
    return <MapLoadingState />;
  }

  // Convert to PhotoFile like structure expected by MapLibreMap if needed, 
  // but better to update MapLibreMap to accept Photo[]
  // Based on current Photo type: { id, url, filename, album, ... }
  // Old PhotoFile: { album, name, url, absUrl }
  // Mapping: absUrl -> url, name -> filename
  
  const mappedPhotos = photos
    .filter(p => p.location)
    .map(p => ({
      album: p.album || '',
      name: p.filename || '',
      url: p.originalUrl,
      absUrl: p.originalUrl,
      // Add GPS for map - adapt to what MapLibreMap expects
      gps: {
        lat: p.location!.latitude,
        lng: p.location!.longitude
      }
    }));

  return <MapLibreMap photos={mappedPhotos} />;
}

function MapLoadingState() {
  return (
    <m.div
      className="flex h-screen w-full items-center justify-center"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="text-center">
        <m.div
          className="mb-4 text-4xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          📍
        </m.div>
        <m.div
          className="text-lg font-medium"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          加载地图中
        </m.div>
        <m.p
          className="text-sm text-zinc-600 dark:text-zinc-400"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          正在解析位置信息...
        </m.p>
      </div>
    </m.div>
  );
}
