import { Suspense } from 'react';
import { MapSection } from '@/modules/map/MapSection';
import { MapLoadingFallback } from './_components/Fallback';

export default function MapPage() {
  return (
    <div className="fixed inset-0 size-full z-9999">
      <Suspense fallback={<MapLoadingFallback />}>
        <MapSection />
      </Suspense>
    </div>
  );
}
