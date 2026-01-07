'use client';

import type { PhotoFile } from '@/lib/photos';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { Image } from '@/components/ui/image/Image';
import { useIsMounted } from '@/hooks/use-is-mounted';
import imageMetadata from '../../../public/image-metadata.json';
import 'leaflet/dist/leaflet.css';

// 修复 Leaflet 默认 icon 路径问题
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function PhotoMap({ photos }: { photos: PhotoFile[] }) {
  const isMounted = useIsMounted();

  if (!isMounted)
    return null;

  // 过滤出有 GPS 信息的照片
  const validPhotos = photos.filter((photo) => {
    const metadata = (imageMetadata as Record<string, any>)[photo.absUrl];
    return metadata && metadata.gps && metadata.gps.lat && metadata.gps.lng;
  });

  if (validPhotos.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-500">
        没有找到包含 GPS 信息的照片
      </div>
    );
  }

  // 计算地图中心点
  const centerLat = validPhotos.reduce((sum, p) => sum + (imageMetadata as Record<string, any>)[p.absUrl].gps.lat, 0) / validPhotos.length;
  const centerLng = validPhotos.reduce((sum, p) => sum + (imageMetadata as Record<string, any>)[p.absUrl].gps.lng, 0) / validPhotos.length;

  return (
    <MapContainer
      center={[centerLat, centerLng]}
      zoom={4}
      style={{ height: '100%', width: '100%', borderRadius: '1rem', zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {validPhotos.map((photo) => {
        const metadata = (imageMetadata as Record<string, any>)[photo.absUrl];
        return (
          <Marker
            key={photo.absUrl}
            position={[metadata.gps.lat, metadata.gps.lng]}
          >
            <Popup className="min-w-[200px]">
              <div className="flex flex-col gap-2">
                <div className="relative h-32 w-full overflow-hidden rounded-md">
                  <Image
                    src={photo.absUrl}
                    alt={photo.name}
                    width={200}
                    height={150}
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="text-sm font-medium">
                  {photo.album}
                  {' '}
                  /
                  {' '}
                  {photo.name}
                </p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
