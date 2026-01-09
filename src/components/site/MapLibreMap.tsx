/**
 * MapLibre Map 组件 - 完全复刻 afilmory 实现
 * 使用新的 PhotoMarkerPin 和 ClusterMarker 组件
 */
'use client';

import type { MapRef } from '@vis.gl/react-maplibre';
import type { PhotoMarker } from '@/lib/map-clustering';
import type { PhotoFile } from '@/lib/photos';
import MapGL from '@vis.gl/react-maplibre';
import { motion as m } from 'motion/react';
import { useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useRef, useState } from 'react';
import { ClusterMarker } from '@/components/site/map/ClusterMarker';
import { CustomMapControls } from '@/components/site/map/CustomMapControls';
import { PhotoMarkerPin } from '@/components/site/map/PhotoMarkerPin';
import { MapInfoPanel } from '@/components/site/MapInfoPanel';
import { useIsMounted } from '@/hooks/use-is-mounted';
import { calculateInitialView, clusterMarkers } from '@/lib/map-clustering';
import { getMapStyle } from '@/lib/map-style';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function MapLibreMap({ photos }: { photos: any[] }) {
  const isMounted = useIsMounted();
  const mapRef = useRef<MapRef>(null);
  const searchParams = useSearchParams();
  const [currentZoom, setCurrentZoom] = useState(10);

  // 从 URL 获取选中的照片ID
  const selectedPhotoId = searchParams?.get('photoId');

  // 转换照片为标记
  const markers = useMemo<PhotoMarker[]>(() => {
    return photos
      .map((photo: any) => {
        // Support both new structure (photo.gps) and old structure if any
        const gps = photo.gps;
        
        if (!gps?.lat || !gps?.lng)
          return null;

        return {
          id: photo.absUrl,
          latitude: gps.lat,
          longitude: gps.lng,
          photo, // Pass the whole photo object, markers assume PhotoFile structure (name, album, absUrl, url)
        };
      })
      .filter((m): m is PhotoMarker => m !== null);
  }, [photos]);

  // 聚类标记
  const clusteredMarkers = useMemo(() => {
    return clusterMarkers(markers, currentZoom);
  }, [markers, currentZoom]);

  // 计算地图边界
  const bounds = useMemo(() => {
    if (markers.length === 0)
      return null;

    const latitudes = markers.map(m => m.latitude);
    const longitudes = markers.map(m => m.longitude);

    return {
      minLat: Math.min(...latitudes),
      maxLat: Math.max(...latitudes),
      minLng: Math.min(...longitudes),
      maxLng: Math.max(...longitudes),
    };
  }, [markers]);

  // 计算初始视图
  const initialViewState = useMemo(() => {
    const view = calculateInitialView(markers);
    setCurrentZoom(view.zoom);
    return view;
  }, [markers]);

  // 处理标记点击
  const handleMarkerClick = useCallback((photo: PhotoFile) => {
    // 更新 URL 参数
    const params = new URLSearchParams(searchParams?.toString() || '');
    if (params.get('photoId') === photo.absUrl) {
      params.delete('photoId');
    }
    else {
      params.set('photoId', photo.absUrl);
    }
    window.history.pushState(null, '', `?${params.toString()}`);
  }, [searchParams]);

  // 处理关闭选中
  const handleCloseSelected = useCallback(() => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.delete('photoId');
    window.history.pushState(null, '', params.toString() ? `?${params.toString()}` : window.location.pathname);
  }, [searchParams]);

  // 处理聚类点击（放大到该位置）
  const handleClusterClick = useCallback((longitude: number, latitude: number) => {
    const map = mapRef.current?.getMap();
    if (map) {
      map.flyTo({
        center: [longitude, latitude],
        zoom: Math.min(currentZoom + 2, 18),
        duration: 1000,
      });
    }
  }, [currentZoom]);

  // 处理缩放变化
  const handleZoomEnd = useCallback((evt: any) => {
    const zoom = evt.viewState.zoom;
    setCurrentZoom(zoom);
  }, []);

  if (!isMounted)
    return null;

  if (markers.length === 0) {
    return (
      <m.div
        className="flex h-[calc(100vh-4rem)] w-full flex-col items-center justify-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <m.div
          className="mb-4 text-4xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          ❌
        </m.div>
        <m.div
          className="text-lg font-medium text-red-900 dark:text-red-100"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          没有找到包含 GPS 信息的照片
        </m.div>
        <m.p
          className="text-sm text-red-600 dark:text-red-400"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          照片需要包含位置信息才能在地图上显示
        </m.p>
      </m.div>
    );
  }

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full">
      <MapInfoPanel markersCount={markers.length} bounds={bounds} />

      <m.div
        initial={{ opacity: 0, scale: 1.02 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="h-full w-full"
      >
        <MapGL
          ref={mapRef}
          initialViewState={initialViewState}
          style={{ width: '100%', height: '100%' }}
          mapStyle={getMapStyle('dark')}
          attributionControl={false}
          onZoomEnd={handleZoomEnd}
        >
          {/* 自定义地图控制（左下角） */}
          <CustomMapControls mapRef={mapRef} />

          {/* 渲染聚类标记或单个标记 */}
          {clusteredMarkers.map((cluster) => {
            if (cluster.isCluster) {
              // 聚类标记
              return (
                <ClusterMarker
                  key={cluster.id}
                  longitude={cluster.longitude}
                  latitude={cluster.latitude}
                  count={cluster.count}
                  photos={cluster.photos}
                  onClick={() => handleClusterClick(cluster.longitude, cluster.latitude)}
                />
              );
            }
            else {
              // 单照片标记
              const photo = cluster.photos[0];
              const isSelected = selectedPhotoId === photo.absUrl;

              return (
                <PhotoMarkerPin
                  key={cluster.id}
                  photo={photo}
                  latitude={cluster.latitude}
                  longitude={cluster.longitude}
                  isSelected={isSelected}
                  onClick={() => handleMarkerClick(photo)}
                  onClose={handleCloseSelected}
                />
              );
            }
          })}
        </MapGL>
      </m.div>
    </div>
  );
}
