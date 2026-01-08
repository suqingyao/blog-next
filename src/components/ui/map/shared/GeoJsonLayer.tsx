import type { GeoJsonLayerProps, LayerProps } from './types';

import { Layer, Source } from 'react-map-gl/maplibre';

const DEFAULT_LAYER_STYLE: LayerProps = {
  id: 'data',
  type: 'fill',
  paint: {
    'fill-color': '#0080ff',
    'fill-opacity': 0.5,
  },
};

export function GeoJsonLayer({ data, layerStyle = DEFAULT_LAYER_STYLE }: GeoJsonLayerProps) {
  return (
    <Source type="geojson" data={data}>
      <Layer {...layerStyle} />
    </Source>
  );
}
