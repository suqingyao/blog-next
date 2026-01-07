/**
 * 自定义地图样式配置
 * 提供深色和浅色主题的完整 MapLibre GL 样式
 */

export interface MapStyle {
  version: 8;
  sources: Record<string, any>;
  layers: any[];
  glyphs?: string;
  sprite?: string;
}

/**
 * 深色地图样式 - 使用 CartoDB Dark Matter Vector Tiles
 * 矢量瓦片提供无限清晰的渲染效果
 */
export const darkMapStyle: MapStyle = {
  version: 8,
  sources: {
    'carto-vector': {
      type: 'vector',
      url: 'https://tiles.basemaps.cartocdn.com/vector/carto.streets/v1/tiles.json',
    },
  },
  glyphs: 'https://tiles.basemaps.cartocdn.com/fonts/{fontstack}/{range}.pbf',
  sprite: 'https://tiles.basemaps.cartocdn.com/gl/dark-matter-gl-style/sprite',
  layers: [
    {
      id: 'background',
      type: 'background',
      paint: {
        'background-color': '#0e0e0e',
      },
    },
    {
      id: 'water',
      type: 'fill',
      source: 'carto-vector',
      'source-layer': 'water',
      paint: {
        'fill-color': '#181818',
      },
    },
    {
      id: 'landcover',
      type: 'fill',
      source: 'carto-vector',
      'source-layer': 'landcover',
      paint: {
        'fill-color': '#1a1a1a',
        'fill-opacity': 0.3,
      },
    },
    {
      id: 'landuse',
      type: 'fill',
      source: 'carto-vector',
      'source-layer': 'landuse',
      paint: {
        'fill-color': '#1a1a1a',
        'fill-opacity': 0.5,
      },
    },
    {
      id: 'park',
      type: 'fill',
      source: 'carto-vector',
      'source-layer': 'park',
      paint: {
        'fill-color': '#1e1e1e',
      },
    },
    {
      id: 'building',
      type: 'fill',
      source: 'carto-vector',
      'source-layer': 'building',
      paint: {
        'fill-color': '#262626',
        'fill-opacity': 0.6,
      },
    },
    {
      id: 'road_minor',
      type: 'line',
      source: 'carto-vector',
      'source-layer': 'transportation',
      filter: ['in', 'class', 'minor', 'service', 'track'],
      paint: {
        'line-color': '#333333',
        'line-width': 1,
      },
    },
    {
      id: 'road_major',
      type: 'line',
      source: 'carto-vector',
      'source-layer': 'transportation',
      filter: ['in', 'class', 'primary', 'secondary', 'tertiary', 'trunk'],
      paint: {
        'line-color': '#3d3d3d',
        'line-width': {
          stops: [
            [8, 0.5],
            [20, 8],
          ],
        },
      },
    },
    {
      id: 'road_motorway',
      type: 'line',
      source: 'carto-vector',
      'source-layer': 'transportation',
      filter: ['==', 'class', 'motorway'],
      paint: {
        'line-color': '#4a4a4a',
        'line-width': {
          stops: [
            [5, 0.5],
            [20, 10],
          ],
        },
      },
    },
    {
      id: 'place_label',
      type: 'symbol',
      source: 'carto-vector',
      'source-layer': 'place',
      layout: {
        'text-field': '{name}',
        'text-font': ['Open Sans Regular'],
        'text-size': {
          stops: [
            [5, 10],
            [15, 14],
          ],
        },
      },
      paint: {
        'text-color': '#666666',
        'text-halo-color': '#0e0e0e',
        'text-halo-width': 1,
      },
    },
  ],
};

/**
 * 浅色地图样式 - 使用 CartoDB Positron Vector Tiles
 * 矢量瓦片提供无限清晰的渲染效果
 */
export const lightMapStyle: MapStyle = {
  version: 8,
  sources: {
    'carto-vector': {
      type: 'vector',
      url: 'https://tiles.basemaps.cartocdn.com/vector/carto.streets/v1/tiles.json',
    },
  },
  glyphs: 'https://tiles.basemaps.cartocdn.com/fonts/{fontstack}/{range}.pbf',
  sprite: 'https://tiles.basemaps.cartocdn.com/gl/positron-gl-style/sprite',
  layers: [
    {
      id: 'background',
      type: 'background',
      paint: {
        'background-color': '#f2f2f2',
      },
    },
    {
      id: 'water',
      type: 'fill',
      source: 'carto-vector',
      'source-layer': 'water',
      paint: {
        'fill-color': '#d4dadc',
      },
    },
    {
      id: 'landcover',
      type: 'fill',
      source: 'carto-vector',
      'source-layer': 'landcover',
      paint: {
        'fill-color': '#e8edeb',
        'fill-opacity': 0.5,
      },
    },
    {
      id: 'landuse',
      type: 'fill',
      source: 'carto-vector',
      'source-layer': 'landuse',
      paint: {
        'fill-color': '#e8edeb',
        'fill-opacity': 0.6,
      },
    },
    {
      id: 'park',
      type: 'fill',
      source: 'carto-vector',
      'source-layer': 'park',
      paint: {
        'fill-color': '#d4edda',
      },
    },
    {
      id: 'building',
      type: 'fill',
      source: 'carto-vector',
      'source-layer': 'building',
      paint: {
        'fill-color': '#e0e0e0',
        'fill-opacity': 0.7,
      },
    },
    {
      id: 'road_minor',
      type: 'line',
      source: 'carto-vector',
      'source-layer': 'transportation',
      filter: ['in', 'class', 'minor', 'service', 'track'],
      paint: {
        'line-color': '#ffffff',
        'line-width': 1,
      },
    },
    {
      id: 'road_major',
      type: 'line',
      source: 'carto-vector',
      'source-layer': 'transportation',
      filter: ['in', 'class', 'primary', 'secondary', 'tertiary', 'trunk'],
      paint: {
        'line-color': '#fefefe',
        'line-width': {
          stops: [
            [8, 0.5],
            [20, 8],
          ],
        },
      },
    },
    {
      id: 'road_motorway',
      type: 'line',
      source: 'carto-vector',
      'source-layer': 'transportation',
      filter: ['==', 'class', 'motorway'],
      paint: {
        'line-color': '#fcfcfc',
        'line-width': {
          stops: [
            [5, 0.5],
            [20, 10],
          ],
        },
      },
    },
    {
      id: 'place_label',
      type: 'symbol',
      source: 'carto-vector',
      'source-layer': 'place',
      layout: {
        'text-field': '{name}',
        'text-font': ['Open Sans Regular'],
        'text-size': {
          stops: [
            [5, 10],
            [15, 14],
          ],
        },
      },
      paint: {
        'text-color': '#5c5c5c',
        'text-halo-color': '#ffffff',
        'text-halo-width': 1.5,
      },
    },
  ],
};

/**
 * 根据主题获取地图样式
 */
export function getMapStyle(theme: 'light' | 'dark' = 'dark'): MapStyle {
  return theme === 'dark' ? darkMapStyle : lightMapStyle;
}

/**
 * 标记样式配置
 */
export const markerStyles = {
  single: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderColor: '#ffffff',
    borderWidth: 3,
    size: 40,
    fontSize: 14,
    shadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
  },
  cluster: {
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    borderColor: '#ffffff',
    borderWidth: 3,
    size: 46,
    fontSize: 16,
    shadow: '0 6px 16px rgba(0, 0, 0, 0.5)',
  },
  hover: {
    scale: 1.15,
    transition: 'transform 0.2s ease-out',
  },
} as const;
