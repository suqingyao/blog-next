# Afilmory Builder 使用指南

## 概述

已将 afilmory 的 builder 包迁移到项目中，用于自动化处理照片并生成 manifest 文件。

## 文件结构

```
blog-next/
├── builder.config.ts              # Builder 配置文件
├── scripts/
│   └── build-photos.ts            # 照片构建脚本
├── src/
│   ├── lib/
│   │   └── builder/              # Afilmory builder 包
│   └── assets/
│       └── photos/               # 源照片目录
├── public/
│   ├── photos/                   # 输出照片目录
│   └── thumbnails/               # 缩略图目录
└── photos-manifest.json          # 生成的 manifest 文件
```

## 配置说明

### builder.config.ts

```typescript
import os from 'node:os'
import { defineBuilderConfig, localStoragePlugin } from './src/lib/builder/index.js'

export default defineBuilderConfig(() => ({
  // 存储配置
  storage: {
    provider: 'local',              // 本地存储
    basePath: './src/assets/photos', // 源照片路径
    baseUrl: '/photos',              // 访问 URL 前缀
  },
  
  // 系统配置
  system: {
    processing: {
      defaultConcurrency: 10,       // 并发处理数量
      enableLivePhotoDetection: true, // 启用 Live Photo 检测
      digestSuffixLength: 0,        // 文件摘要后缀长度
    },
    observability: {
      showProgress: true,           // 显示进度
      showDetailedStats: true,      // 显示详细统计
      performance: {
        worker: {
          workerCount: os.cpus().length, // Worker 数量
          timeout: 30_000,          // 超时时间 (ms)
          useClusterMode: false,    // 是否启用集群模式
          workerConcurrency: 2,     // 每个 Worker 的并发数
        },
      },
    },
  },
  
  // 插件配置
  plugins: [
    localStoragePlugin({
      outputDir: './public/photos',
      thumbnailDir: './public/thumbnails',
      manifestPath: './photos-manifest.json',
    }),
  ],
}))
```

## 使用方法

### 1. 增量构建（推荐）

只处理新增或修改的照片：

```bash
pnpm build:photos
```

### 2. 全量重建

强制重新处理所有照片：

```bash
pnpm build:photos:force
```

### 3. 强制重新生成缩略图

保留已处理的照片，仅重新生成缩略图：

```bash
pnpm build:photos -- --force-thumbnails
```

## 功能特性

### ✅ 自动处理

- **EXIF 提取**: 自动提取相机、镜头、拍摄参数等信息
- **GPS 转换**: 自动将 DMS 格式转换为十进制坐标
- **方向校正**: 根据 EXIF Orientation 自动旋转照片
- **缩略图生成**: 自动生成优化的缩略图
- **Blurhash/Thumbhash**: 自动生成占位符哈希

### ✅ 智能优化

- **增量处理**: 只处理变更的照片
- **并发处理**: 多核心并发提升速度
- **内存优化**: 流式处理大图片
- **缓存机制**: 避免重复处理

### ✅ 格式支持

- JPEG/JPG
- PNG
- WebP
- HEIF/HEIC
- AVIF
- Live Photo
- Motion Photo

## Manifest 文件结构

生成的 `photos-manifest.json` 包含：

```json
{
  "version": "v10",
  "data": [
    {
      "id": "photo-id",
      "s3Key": "folder/photo.jpg",
      "originalUrl": "/photos/folder/photo.jpg",
      "thumbnailUrl": "/thumbnails/photo-id.jpg",
      "format": "jpg",
      "width": 1920,
      "height": 1080,
      "aspectRatio": 1.7778,
      "size": 1048576,
      "lastModified": "2024-01-01T00:00:00.000Z",
      "title": "photo",
      "dateTaken": "2024-01-01T12:00:00.000Z",
      "tags": ["folder"],
      "exif": {
        "Make": "Canon",
        "Model": "EOS R5",
        "GPSLatitude": 31.972225,   // ✅ 十进制坐标
        "GPSLongitude": 118.792359,
        "GPSLatitudeRef": "N",
        "GPSLongitudeRef": "E",
        // ... 更多 EXIF 信息
      },
      "location": {
        "latitude": 31.972225,
        "longitude": 118.792359,
        "country": "中国",
        "city": "南京"
      },
      "thumbHash": "...",
      "blurhash": "..."
    }
  ]
}
```

## 高级配置

### 使用 S3 存储

```typescript
// builder.config.ts
export default defineBuilderConfig(() => ({
  storage: {
    provider: 's3',
    bucket: 'your-bucket',
    region: 'us-east-1',
    endpoint: 'https://s3.amazonaws.com',
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    prefix: 'photos/',
    customDomain: 'https://cdn.example.com',
  },
  // ...
}))
```

### 启用地理编码

```typescript
import { geocodingPlugin } from './src/lib/builder/index.js'

export default defineBuilderConfig(() => ({
  // ...
  plugins: [
    localStoragePlugin({ /* ... */ }),
    geocodingPlugin({
      provider: 'nominatim', // 免费
      // 或使用 Mapbox (需要 token)
      // provider: 'mapbox',
      // mapboxToken: process.env.MAPBOX_TOKEN,
    }),
  ],
}))
```

### 启用多进程模式

适合大批量照片处理：

```typescript
export default defineBuilderConfig(() => ({
  system: {
    observability: {
      performance: {
        worker: {
          useClusterMode: true,         // ✅ 启用集群模式
          workerCount: os.cpus().length * 2, // 使用更多 worker
          workerConcurrency: 4,         // 增加并发数
        },
      },
    },
  },
}))
```

## 与原脚本对比

| 功能 | 原脚本 (generate-manifest) | Builder | 优势 |
|------|---------------------------|---------|------|
| GPS 转换 | ❌ 手动处理 | ✅ 自动 | 无需修改代码 |
| 方向校正 | ❌ 手动添加 .rotate() | ✅ 自动 | 内置支持 |
| 增量处理 | ✅ 基于 mtime | ✅ 基于缓存 | 更可靠 |
| 并发处理 | ❌ 单线程 | ✅ 多进程 | 速度更快 |
| Live Photo | ❌ 不支持 | ✅ 支持 | 更强大 |
| 地理编码 | ❌ 不支持 | ✅ 可选插件 | 更灵活 |
| 代码维护 | ⚠️ 需要手动同步 | ✅ 与 afilmory 同步 | 更易维护 |

## 故障排查

### 问题：运行失败

```bash
# 检查配置
pnpm build:photos -- --help

# 启用详细日志
# 修改 builder.config.ts
logging: {
  verbose: true,
  level: 'debug',
}
```

### 问题：照片方向错误

Builder 会自动根据 EXIF Orientation 旋转，如果仍有问题：

1. 检查照片是否有 EXIF 信息
2. 尝试全量重建：`pnpm build:photos:force`

### 问题：GPS 坐标显示错误

Builder 会自动转换 DMS 为十进制，生成的 manifest 中：
- `exif.GPSLatitude`: number (十进制)
- `exif.GPSLongitude`: number (十进制)

前端 `map-utils.ts` 和 `formatExifData.tsx` 无需修改。

## 迁移指南

### 从旧脚本迁移

1. **备份现有 manifest**：
   ```bash
   cp photos-manifest.json photos-manifest.json.backup
   ```

2. **首次运行 builder**：
   ```bash
   pnpm build:photos:force
   ```

3. **验证结果**：
   ```bash
   # 检查照片数量
   node -e "console.log(require('./photos-manifest.json').data.length)"
   
   # 检查 GPS 格式
   node -e "const m = require('./photos-manifest.json'); const p = m.data.find(x => x.exif?.GPSLatitude); console.log('GPS type:', typeof p.exif.GPSLatitude, p.exif.GPSLatitude)"
   ```

4. **测试前端显示**：
   ```bash
   pnpm dev
   # 访问 /photos 页面检查
   ```

## 性能建议

- **开发环境**: `useClusterMode: false` (更快的启动)
- **生产构建**: `useClusterMode: true` (更快的处理)
- **大批量照片** (>1000张): 增加 `workerCount` 和 `workerConcurrency`
- **低内存环境**: 减少 `defaultConcurrency` 和 `workerCount`

## 下一步

现在可以：

1. ✅ 移除旧的 `scripts/generate-manifest-from-assets.js`
2. ✅ 使用 `pnpm build:photos` 替代 `pnpm generate:manifest`
3. ✅ 享受自动化的照片处理流程
4. ✅ 与 afilmory 保持同步更新
