import os from 'node:os';
import { defineBuilderConfig, localStoragePlugin } from './src/lib/builder/index.js';

export default defineBuilderConfig(() => ({
  // 存储配置 - 指定从哪里读取照片
  storage: {
    provider: 'local',
    basePath: 'public/photos', // 源照片目录
    baseUrl: '/photos', // 访问 URL 前缀
  },

  // 系统配置
  system: {
    processing: {
      defaultConcurrency: 10,
      enableLivePhotoDetection: true,
      digestSuffixLength: 0,
    },
    observability: {
      showProgress: true,
      showDetailedStats: true,
      logging: {
        verbose: false,
        level: 'info',
        outputToFile: false,
      },
      performance: {
        worker: {
          workerCount: os.cpus().length,
          timeout: 30_000,
          useClusterMode: false, // 开发环境建议 false，生产环境可设为 true
          workerConcurrency: 2,
        },
      },
    },
  },

  // 插件配置
  plugins: [
    // 本地存储插件 - 注册本地存储提供者
    localStoragePlugin(),

    // 地理编码插件 - 可选，用于反向地理定位
    // geocodingPlugin({
    //   provider: 'nominatim', // 或 'mapbox'
    //   // mapboxToken: process.env.MAPBOX_TOKEN,
    // }),
  ],
}));
