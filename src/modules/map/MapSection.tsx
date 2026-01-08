import type { MapBounds, PhotoMarker } from '@/types/map';
import { m } from 'motion/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { GenericMap, MapBackButton, MapInfoPanel, MapLoadingState } from '@/components/ui/map';
import {
  calculateMapBounds,
  convertExifGPSToDecimal,
  convertPhotosToMarkersFromEXIF,
  getInitialViewStateForMarkers,
} from '@/lib/map-utils';
import { photoLoader } from '@/lib/photo-loader';
import { MapProvider } from '@/modules/map/MapProvider';

export function MapSection() {
  return (
    <MapProvider>
      <MapSectionContent />
    </MapProvider>
  );
}

function MapSectionContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Photo markers state and loading logic
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [markers, setMarkers] = useState<PhotoMarker[]>([]);

  // Track if this is the initial load to control auto fit bounds
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Handle marker click - update URL parameters
  const handleMarkerClick = useCallback(
    (marker: PhotoMarker) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());

      // Check if this marker is already selected
      const currentPhotoId = searchParams.get('photoId');

      if (currentPhotoId === marker.id) {
        // If already selected, deselect by removing the photoId parameter
        newSearchParams.delete('photoId');
      }
      else {
        // Select the new marker
        newSearchParams.set('photoId', marker.id);
      }

      router.replace(`${pathname}?${newSearchParams.toString()}`);

      // Mark that this is no longer the initial load
      setIsInitialLoad(false);
    },
    [searchParams, pathname, router],
  );
  const bounds = useMemo<MapBounds | null>(() => {
    if (markers.length === 0)
      return null;
    return calculateMapBounds(markers);
  }, [markers]);

  // Load photo markers effect
  useEffect(() => {
    const loadPhotoMarkersData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const photos = photoLoader.getPhotos();
        const photoMarkers = convertPhotosToMarkersFromEXIF(photos);

        setMarkers(photoMarkers);
        console.info(`Found ${photoMarkers.length} photos with GPS coordinates`);
      }
      catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to load photo markers');
        setError(error);
        console.error('Failed to load photo markers:', error);
      }
      finally {
        setIsLoading(false);
      }
    };

    loadPhotoMarkersData();
  }, [setMarkers]);

  // Parse URL parameters - only use photoId
  const { latitude, longitude, zoom, photoId } = useMemo(() => {
    const photoIdParam = searchParams.get('photoId');

    if (photoIdParam) {
      const photo = photoLoader.getPhoto(photoIdParam);
      const gpsData = convertExifGPSToDecimal(photo?.exif ?? null);

      if (gpsData) {
        return {
          latitude: gpsData.latitude,
          longitude: gpsData.longitude,
          zoom: 15, // Default zoom when coordinates derived from photo
          photoId: photoIdParam,
        };
      }
    }

    return {
      latitude: null,
      longitude: null,
      zoom: null,
      photoId: photoIdParam,
    };
  }, [searchParams]);

  // Initial view state calculation - handle URL parameters
  const initialViewState = useMemo(() => {
    if (latitude !== null && longitude !== null) {
      // Use URL parameters if provided
      return {
        latitude,
        longitude,
        zoom: zoom ?? 15,
      };
    }

    // Fall back to markers-based view state
    return getInitialViewStateForMarkers(markers);
  }, [markers, latitude, longitude, zoom]);

  // Show loading state
  if (isLoading) {
    return <MapLoadingState />;
  }

  // Show error state
  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-4xl">❌</div>
          <div className="text-lg font-medium text-red-900 dark:text-red-100">地图加载失败</div>
          <p className="text-sm text-red-600 dark:text-red-400">无法加载地图数据，请稍后重试</p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute h-full w-full">
      {/* Back button */}
      <MapBackButton />

      {/* Map info panel */}
      <MapInfoPanel markersCount={markers.length} bounds={bounds} />

      {/* Generic Map component */}
      <m.div
        initial={{ opacity: 0, scale: 1.02 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="h-full w-full"
      >
        <GenericMap
          markers={markers}
          initialViewState={initialViewState}
          autoFitBounds={isInitialLoad && latitude === null && longitude === null}
          selectedMarkerId={photoId}
          onMarkerClick={handleMarkerClick}
          className="h-full w-full"
        />
      </m.div>
    </div>
  );
}
