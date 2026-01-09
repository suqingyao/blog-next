import { lazy } from 'react';

const MapSection = lazy(() => import('@/modules/map/MapSection').then(m => ({ default: m.MapSection })));

export default function MapPage() {
  return <MapSection />;
}
