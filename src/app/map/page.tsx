import { MapClient } from '@/components/site/MapClient';

export default function MapPage() {
  // Photos will be loaded via client-side loader or we need to update MapClient to use provider
  // Since MapClient is a client component, better to let it use the provider
  return <MapClient />;
}
