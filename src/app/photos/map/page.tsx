'use client';

import { lazy, useMemo, useState } from 'react';
import { RemoveScroll } from 'react-remove-scroll';
import { ClientOnly } from '@/components/common/ClientOnly';
import { RootPortal, RootPortalProvider } from '@/components/ui/portal';

const MapSection = lazy(() => import('@/modules/map/MapSection').then(m => ({ default: m.MapSection })));

export default function MapPage() {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const rootPortalValue = useMemo(
    () => ({
      to: ref as HTMLElement,
    }),
    [ref],
  );

  return (
    <ClientOnly>
      <RootPortal>
        <RootPortalProvider value={rootPortalValue}>
          <RemoveScroll
            ref={setRef}
            className="fixed inset-0 z-9999"
          >
            <MapSection />
          </RemoveScroll>
        </RootPortalProvider>
      </RootPortal>
    </ClientOnly>
  );
}
