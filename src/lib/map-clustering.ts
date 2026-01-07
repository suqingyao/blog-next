/**
 * 地图标记聚类工具
 * 基于缩放级别智能聚合相近的照片标记
 */

export interface PhotoMarker {
  id: string;
  latitude: number;
  longitude: number;
  photo: any;
}

export interface ClusteredMarker {
  id: string;
  latitude: number;
  longitude: number;
  photos: any[];
  count: number;
  isCluster: boolean;
}

/**
 * 聚合标记 - 基于距离的聚类算法
 * 参考 afilmory 的实现理念，使用原创代码
 */
export function clusterMarkers(
  markers: PhotoMarker[],
  zoom: number,
): ClusteredMarker[] {
  if (markers.length === 0)
    return [];

  // 高缩放级别不聚类
  if (zoom >= 15) {
    return markers.map(marker => ({
      id: marker.id,
      latitude: marker.latitude,
      longitude: marker.longitude,
      photos: [marker.photo],
      count: 1,
      isCluster: false,
    }));
  }

  const clusters: ClusteredMarker[] = [];
  const processed = new Set<string>();

  // 根据缩放级别计算距离阈值
  const threshold = Math.max(0.001, 0.01 / 2 ** (zoom - 10));

  for (const marker of markers) {
    if (processed.has(marker.id))
      continue;

    const nearby = [marker];
    processed.add(marker.id);

    // 查找附近的标记
    for (const other of markers) {
      if (processed.has(other.id))
        continue;

      // 计算欧氏距离
      const distance = Math.sqrt(
        (marker.longitude - other.longitude) ** 2
        + (marker.latitude - other.latitude) ** 2,
      );

      if (distance < threshold) {
        nearby.push(other);
        processed.add(other.id);
      }
    }

    if (nearby.length === 1) {
      // 单个标记
      clusters.push({
        id: marker.id,
        latitude: marker.latitude,
        longitude: marker.longitude,
        photos: [marker.photo],
        count: 1,
        isCluster: false,
      });
    }
    else {
      // 聚类 - 计算中心点（平均位置）
      const centerLng = nearby.reduce((sum, m) => sum + m.longitude, 0) / nearby.length;
      const centerLat = nearby.reduce((sum, m) => sum + m.latitude, 0) / nearby.length;

      clusters.push({
        id: `cluster-${centerLat.toFixed(4)}-${centerLng.toFixed(4)}`,
        latitude: centerLat,
        longitude: centerLng,
        photos: nearby.map(m => m.photo),
        count: nearby.length,
        isCluster: true,
      });
    }
  }

  return clusters;
}

/**
 * 计算地图边界
 */
export interface MapBounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

export function calculateMapBounds(markers: PhotoMarker[]): MapBounds | null {
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
}

/**
 * 根据标记计算初始视图
 */
export function calculateInitialView(markers: PhotoMarker[]): {
  longitude: number;
  latitude: number;
  zoom: number;
} {
  if (markers.length === 0) {
    return { longitude: 0, latitude: 0, zoom: 2 };
  }

  if (markers.length === 1) {
    return {
      longitude: markers[0].longitude,
      latitude: markers[0].latitude,
      zoom: 13,
    };
  }

  const bounds = calculateMapBounds(markers)!;
  const centerLng = (bounds.minLng + bounds.maxLng) / 2;
  const centerLat = (bounds.minLat + bounds.maxLat) / 2;

  // 计算合适的缩放级别
  const latDiff = bounds.maxLat - bounds.minLat;
  const lngDiff = bounds.maxLng - bounds.minLng;
  const maxDiff = Math.max(latDiff, lngDiff);

  let zoom = 10;
  if (maxDiff < 0.001)
    zoom = 16;
  else if (maxDiff < 0.01)
    zoom = 14;
  else if (maxDiff < 0.1)
    zoom = 11;
  else if (maxDiff < 1)
    zoom = 8;
  else if (maxDiff < 10)
    zoom = 5;
  else zoom = 2;

  return {
    longitude: centerLng,
    latitude: centerLat,
    zoom,
  };
}
