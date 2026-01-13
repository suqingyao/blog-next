# Live Photo 与 Motion Photo 完整指南

本文档详细说明了 afilmory 项目中 Live Photo 和 Motion Photo 的检测、处理和播放机制，以及在本项目中的实现。

## 目录

- [概念介绍](#概念介绍)
- [技术架构](#技术架构)
- [Builder 端处理](#builder-端处理)
- [前端播放](#前端播放)
- [实现对比](#实现对比)
- [最佳实践](#最佳实践)

---

## 概念介绍

### Live Photo

**定义**：Apple 设备的动态照片格式，由**一张静态图片**和**一个独立的 MOV 视频文件**组成。

**文件结构**：
```
IMG_1234.HEIC  (静态图片)
IMG_1234.MOV   (3秒视频)
```

**特征**：
- 两个独立文件，文件名相同（扩展名不同）
- 视频文件通常是 MOV 格式
- 拍摄设备：iPhone、iPad

**使用场景**：
- iPhone 相册导出
- macOS 照片应用导出
- iCloud 同步

---

### Motion Photo

**定义**：Android（主要是 Google Pixel 和三星）的动态照片格式，将视频**嵌入到 JPEG 文件末尾**。

**文件结构**：
```
IMG_5678.jpg
├── JPEG 图片数据
└── MP4 视频数据 (嵌入在末尾)
```

**特征**：
- 单个文件包含图片和视频
- 视频以 MP4 格式嵌入在 JPEG 末尾
- 通过 EXIF/XMP 元数据标记偏移量
- 拍摄设备：Google Pixel、Samsung Galaxy

**元数据标记**：

1. **标准格式**（Motion Photo 1.0）：
   ```typescript
   MotionPhoto: 1
   ContainerDirectory: [
     { Item: { Semantic: 'MotionPhoto', Length: 123456 } }
   ]
   ```

2. **三星格式**（Legacy）：
   ```typescript
   MicroVideo: 1
   MicroVideoOffset: 123456
   ```

**使用场景**：
- Google Photos 备份
- 三星相册
- 原始设备导出

---

## 技术架构

### 架构图

```
┌─────────────────────────────────────────────────────────────┐
│                       用户设备                                │
├─────────────────────────────────────────────────────────────┤
│  • iPhone: Live Photo (HEIC + MOV)                          │
│  • Pixel:  Motion Photo (JPEG with embedded MP4)           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Builder 构建流程                           │
├─────────────────────────────────────────────────────────────┤
│  1. 扫描存储 (S3/本地/GitHub)                                 │
│  2. Live Photo 检测                                          │
│     └─ createLivePhotoMap(): 按文件名匹配                    │
│  3. Motion Photo 检测                                        │
│     └─ detectMotionPhoto(): 读取 EXIF/XMP                   │
│  4. 冲突检查                                                  │
│     └─ 不允许同时存在 Live Photo 和 Motion Photo             │
│  5. 生成 Manifest                                            │
│     └─ video: { type, ... }                                 │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      photos-manifest.json                    │
├─────────────────────────────────────────────────────────────┤
│  {                                                           │
│    "id": "photo-123",                                        │
│    "originalUrl": "/photos/IMG_1234.jpg",                   │
│    "video": {                                                │
│      "type": "live-photo",           // or "motion-photo"   │
│      "videoUrl": "/photos/IMG_1234.mov",  // Live Photo     │
│      "s3Key": "photos/IMG_1234.mov"       // Live Photo     │
│      // OR                                                   │
│      "offset": 123456,               // Motion Photo        │
│      "size": 234567                  // Motion Photo        │
│    }                                                         │
│  }                                                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                     前端播放流程                              │
├─────────────────────────────────────────────────────────────┤
│  1. 读取 manifest                                            │
│  2. 解析 video.type                                          │
│  3. 按类型处理：                                              │
│     • Live Photo:                                            │
│       └─ 加载独立视频文件                                     │
│           └─ MOV → MP4 转码 (WebCodecs)                     │
│     • Motion Photo:                                          │
│       └─ 提取嵌入视频                                         │
│           ├─ Range Request (offset-offset+size)             │
│           └─ Fallback: 完整下载 + slice                     │
│  4. 播放控制                                                  │
│     └─ LivePhotoVideo 组件                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Builder 端处理

### 1. Live Photo 检测

#### 原理

Live Photo 通过**文件名匹配**识别：

```typescript
// 输入文件列表
IMG_1234.HEIC
IMG_1234.MOV
IMG_5678.HEIC
```

**匹配逻辑**：

```typescript
function createLivePhotoMap(objects: S3ObjectLike[]): Map<string, S3ObjectLike> {
  const livePhotoMap = new Map()
  const photos = []
  const videos = []

  // 1. 分离照片和视频
  for (const obj of objects) {
    const ext = obj.Key.toLowerCase().split('.').pop()
    if (['jpg', 'jpeg', 'heic', 'heif', 'png', 'webp'].includes(ext)) {
      photos.push(obj)
    } else if (['mov', 'mp4'].includes(ext)) {
      videos.push(obj)
    }
  }

  // 2. 按文件名匹配
  for (const photo of photos) {
    const photoBaseName = photo.Key.replace(/\.[^/.]+$/, '') // 去掉扩展名
    const matchingVideo = videos.find(video => {
      const videoBaseName = video.Key.replace(/\.[^/.]+$/, '')
      return videoBaseName === photoBaseName
    })
    if (matchingVideo) {
      livePhotoMap.set(photo.Key, matchingVideo) // IMG_1234.HEIC -> IMG_1234.MOV
    }
  }

  return livePhotoMap
}
```

**结果**：

```
Map {
  'IMG_1234.HEIC' => { Key: 'IMG_1234.MOV', Size: 2048576, ... }
}
```

#### 写入 Manifest

```typescript
async function processLivePhoto(
  photoKey: string,
  livePhotoMap: Map<string, S3ObjectLike>,
  storageManager: StorageManager,
): Promise<LivePhotoResult> {
  const livePhotoVideo = livePhotoMap.get(photoKey)
  if (!livePhotoVideo) {
    return { isLivePhoto: false }
  }

  const videoKey = livePhotoVideo.Key
  const livePhotoVideoUrl = await storageManager.generatePublicUrl(videoKey)

  return {
    isLivePhoto: true,
    livePhotoVideoUrl,        // https://cdn.example.com/photos/IMG_1234.mov
    livePhotoVideoS3Key: videoKey,  // photos/IMG_1234.mov
  }
}
```

**Manifest 输出**：

```json
{
  "id": "IMG_1234",
  "video": {
    "type": "live-photo",
    "videoUrl": "https://cdn.example.com/photos/IMG_1234.mov",
    "s3Key": "photos/IMG_1234.mov"
  }
}
```

---

### 2. Motion Photo 检测

#### 原理

Motion Photo 通过**读取 EXIF/XMP 元数据**检测：

```typescript
export const detectMotionPhoto = ({
  rawImageBuffer,
  exifData,
  logger,
}: MotionPhotoDetectParams): MotionPhotoMetadata | null => {
  const rawLength = rawImageBuffer.length

  // 1️⃣ 检查标记
  const isMotionPhotoFlag = 
    toBoolean(exifData?.MotionPhoto) || 
    toBoolean(exifData?.MicroVideo)

  // 2️⃣ 提取时间戳
  const presentationTimestampUs = toNumber(
    exifData?.MotionPhotoPresentationTimestampUs ?? 
    exifData?.MicroVideoPresentationTimestampUs
  )

  let videoOffset: number | null = null
  let videoSize: number | null = null

  // 3️⃣ 尝试标准格式（Motion Photo 1.0）
  const containerDirectory = exifData?.ContainerDirectory as ContainerDirectoryItem[]
  if (containerDirectory && Array.isArray(containerDirectory)) {
    for (const entry of containerDirectory) {
      if (entry.Item?.Semantic === 'MotionPhoto' && entry.Item?.Length) {
        // 视频在文件末尾
        const offset = rawLength - entry.Item.Length
        if (validateMp4Buffer(rawImageBuffer.subarray(offset))) {
          videoOffset = offset
          videoSize = entry.Item.Length
          break
        }
      }
    }
  }

  // 4️⃣ Fallback: 三星格式（Legacy）
  if (videoOffset === null && isMotionPhotoFlag) {
    const legacyOffset = toNumber(exifData?.MicroVideoOffset)
    if (legacyOffset !== null) {
      // 尝试两种解释：从文件开头或从文件末尾
      const candidates = [legacyOffset, rawLength - legacyOffset]
      for (const offset of candidates) {
        if (validateMp4Buffer(rawImageBuffer.subarray(offset))) {
          videoOffset = offset
          videoSize = rawImageBuffer.length - offset
          break
        }
      }
    }
  }

  // 5️⃣ 验证结果
  if (videoOffset === null || videoSize === null) {
    return null
  }

  return {
    isMotionPhoto: true,
    motionPhotoOffset: videoOffset,
    motionPhotoVideoSize: videoSize,
    presentationTimestampUs,
  }
}
```

#### MP4 验证

```typescript
const MP4_FTYP = Buffer.from('ftyp')

function validateMp4Buffer(buffer: Buffer): boolean {
  if (buffer.length < 8 * 1024) {  // 至少 8KB
    return false
  }
  // 查找 MP4 标识 'ftyp'
  const searchWindow = buffer.subarray(0, 32)
  return searchWindow.includes(MP4_FTYP)
}
```

#### Manifest 输出

```json
{
  "id": "IMG_5678",
  "video": {
    "type": "motion-photo",
    "offset": 123456,
    "size": 234567,
    "presentationTimestamp": 3000000
  }
}
```

---

### 3. 冲突检查

**不允许同时存在 Live Photo 和 Motion Photo**：

```typescript
// 在 image-pipeline.ts 中
if (motionPhotoMetadata?.isMotionPhoto && livePhotoResult.isLivePhoto) {
  const errorMsg = `❌ 检测到同时存在 Motion Photo (嵌入视频) 和 Live Photo (独立视频文件)：${photoKey}。这是不允许的，请只保留一种格式。`
  throw new Error(errorMsg)
}
```

**原因**：
- 避免数据冲突
- 简化前端处理逻辑
- 保证数据一致性

---

## 前端播放

### 1. VideoSource 类型定义

**Sum Type（联合类型）**：

```typescript
export type VideoSource
  = | { type: 'live-photo'; videoUrl: string }
    | { type: 'motion-photo'; imageUrl: string; offset: number; size?: number; presentationTimestamp?: number }
    | { type: 'none' }
```

**优势**：
- 类型安全：TypeScript 强制穷举处理
- 清晰的模式匹配
- 易于扩展（未来可添加其他类型）

---

### 2. Live Photo 播放

#### 流程

```
1. 读取 manifest.video.videoUrl
   ↓
2. 检查文件格式
   ↓
3. MOV 格式？
   ├─ 是 → WebCodecs 转码为 MP4
   └─ 否 → 直接加载
   ↓
4. 设置 video.src
   ↓
5. 播放控制
```

#### 代码实现

```typescript
// image-loader-manager.ts
if (videoSource.type === 'live-photo') {
  if (needsVideoConversion(videoSource.videoUrl)) {
    // MOV → MP4 转码
    const result = await this.convertVideo(
      videoSource.videoUrl,
      videoElement,
      callbacks
    )
    resolve(result)
  } else {
    // 直接加载（已经是 MP4）
    const result = await this.loadDirectVideo(
      videoSource.videoUrl,
      videoElement
    )
    resolve(result)
  }
}
```

#### MOV 转码（WebCodecs）

```typescript
async function convertMovToMp4(
  movUrl: string,
  videoElement: HTMLVideoElement,
  callbacks: LoadingCallbacks
): Promise<VideoProcessResult> {
  // 1. 下载 MOV 文件
  const response = await fetch(movUrl)
  const blob = await response.blob()

  // 2. WebCodecs 转码
  const mp4Blob = await transcodeToMp4(blob, callbacks)

  // 3. 创建 Blob URL
  const mp4BlobUrl = URL.createObjectURL(mp4Blob)

  // 4. 设置视频源
  videoElement.src = mp4BlobUrl
  videoElement.load()

  return {
    convertedVideoUrl: mp4BlobUrl,
    conversionMethod: 'webcodecs-mov-to-mp4',
  }
}
```

---

### 3. Motion Photo 播放

#### 流程

```
1. 读取 manifest.video.offset 和 size
   ↓
2. 尝试 Range Request
   ├─ 成功 → 只下载视频部分
   └─ 失败 → Fallback 完整下载
   ↓
3. 提取视频数据
   ↓
4. 验证 MP4 格式
   ↓
5. 创建 Blob URL
   ↓
6. 设置 video.src
```

#### 代码实现

```typescript
// motion-photo-extractor.ts
export async function extractMotionPhotoVideo(
  imageUrl: string,
  metadata: MotionPhotoMetadata
): Promise<string | null> {
  const { motionPhotoOffset, motionPhotoVideoSize } = metadata

  // 1️⃣ 尝试 Range Request（性能最优）
  if (motionPhotoVideoSize && motionPhotoVideoSize > 0) {
    try {
      const videoBlob = await fetchVideoWithRange(
        imageUrl,
        motionPhotoOffset,
        motionPhotoVideoSize
      )
      if (videoBlob) {
        return URL.createObjectURL(videoBlob)
      }
    } catch (rangeError) {
      console.debug('Range request failed, falling back to full fetch')
    }
  }

  // 2️⃣ Fallback: 完整下载
  const videoBlob = await fetchVideoWithFullDownload(
    imageUrl,
    motionPhotoOffset,
    motionPhotoVideoSize
  )
  if (videoBlob) {
    return URL.createObjectURL(videoBlob)
  }

  return null
}

// Range Request 实现
async function fetchVideoWithRange(
  imageUrl: string,
  offset: number,
  size: number
): Promise<Blob | null> {
  const endByte = offset + size - 1
  const response = await fetch(imageUrl, {
    headers: {
      Range: `bytes=${offset}-${endByte}`,
    },
  })

  if (response.status !== 206) {
    throw new Error('Range request not supported')
  }

  const blob = await response.blob()

  // 验证 MP4
  if (!(await isValidMp4(blob))) {
    throw new Error('Invalid MP4 data')
  }

  return new Blob([blob], { type: 'video/mp4' })
}

// 完整下载实现
async function fetchVideoWithFullDownload(
  imageUrl: string,
  offset: number,
  size?: number
): Promise<Blob | null> {
  const response = await fetch(imageUrl)
  const arrayBuffer = await response.arrayBuffer()

  // 提取视频部分
  const videoData = size
    ? arrayBuffer.slice(offset, offset + size)
    : arrayBuffer.slice(offset)

  const blob = new Blob([videoData], { type: 'video/mp4' })

  // 验证 MP4
  if (!(await isValidMp4(blob))) {
    console.warn('Extracted data is not a valid MP4')
    return null
  }

  return blob
}
```

#### MP4 验证

```typescript
async function isValidMp4(blob: Blob): Promise<boolean> {
  if (blob.size < 32) return false

  const header = await blob.slice(0, 32).arrayBuffer()
  const headerBytes = new Uint8Array(header)

  // 查找 'ftyp' 标识 (0x66 0x74 0x79 0x70)
  const ftypSignature = [0x66, 0x74, 0x79, 0x70]
  for (let i = 0; i <= headerBytes.length - 4; i++) {
    if (
      headerBytes[i] === ftypSignature[0] &&
      headerBytes[i + 1] === ftypSignature[1] &&
      headerBytes[i + 2] === ftypSignature[2] &&
      headerBytes[i + 3] === ftypSignature[3]
    ) {
      return true
    }
  }

  return false
}
```

---

### 4. LivePhotoVideo 组件

**统一的播放控制组件**：

```typescript
interface LivePhotoVideoProps {
  videoSource: VideoSource
  imageLoaderManager: ImageLoaderManager
  loadingIndicatorRef: React.RefObject<LoadingIndicatorRef | null>
  isCurrentImage: boolean
  className?: string
  onPlayingChange?: (isPlaying: boolean) => void
  shouldAutoPlayOnce?: boolean
}

export const LivePhotoVideo = ({
  videoSource,
  imageLoaderManager,
  loadingIndicatorRef,
  isCurrentImage,
  shouldAutoPlayOnce = false,
}: LivePhotoVideoProps) => {
  const [isPlayingLivePhoto, setIsPlayingLivePhoto] = useState(false)
  const [livePhotoVideoLoaded, setLivePhotoVideoLoaded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // 🎬 处理视频加载
  useEffect(() => {
    if (!isCurrentImage || livePhotoVideoLoaded || !videoRef.current) {
      return
    }
    if (videoSource.type === 'none') {
      return
    }

    const processVideo = async () => {
      await imageLoaderManager.processVideo(
        videoSource,
        videoRef.current!,
        {
          onLoadingStateUpdate: (state) => {
            loadingIndicatorRef.current?.updateLoadingState(state)
          },
        }
      )
      setLivePhotoVideoLoaded(true)
    }

    processVideo()
  }, [isCurrentImage, livePhotoVideoLoaded, videoSource])

  // ▶️ 播放控制
  const play = useCallback(async () => {
    if (!livePhotoVideoLoaded || isPlayingLivePhoto) return
    setIsPlayingLivePhoto(true)
    const video = videoRef.current
    if (video) {
      video.currentTime = 0
      await video.play()
    }
  }, [livePhotoVideoLoaded, isPlayingLivePhoto])

  const stop = useCallback(async () => {
    if (!isPlayingLivePhoto) return
    const video = videoRef.current
    if (video) {
      video.pause()
      video.currentTime = 0
    }
    setIsPlayingLivePhoto(false)
  }, [isPlayingLivePhoto])

  // 🎥 视频元素
  return (
    <video
      ref={videoRef}
      className="absolute inset-0 z-10 h-full w-full object-contain"
      style={{ opacity: isPlayingLivePhoto ? 1 : 0 }}
      muted
      playsInline
      onEnded={stop}
    />
  )
}
```

---

## 实现对比

### afilmory vs 本项目

| 特性 | afilmory | 本项目 |
|------|----------|--------|
| **Live Photo 检测** | ✅ createLivePhotoMap | ✅ 相同实现 |
| **Motion Photo 检测** | ✅ detectMotionPhoto | ✅ 相同实现 |
| **标准格式支持** | ✅ ContainerDirectory | ✅ 相同 |
| **三星格式支持** | ✅ MicroVideoOffset | ✅ 相同 |
| **冲突检查** | ✅ 抛出错误 | ✅ 相同 |
| **Range Request** | ✅ 支持 | ✅ 支持 |
| **Fallback 下载** | ✅ 支持 | ✅ 支持 |
| **MOV 转码** | ✅ WebCodecs | ✅ 相同 |
| **播放组件** | ✅ LivePhotoVideo | ✅ 相同 |
| **AbortError 处理** | ⚠️ 无 | ✅ 已修复 |
| **优雅降级** | ⚠️ 无 | ✅ 已实现 |

### 本项目的改进

1. **AbortError 修复**
   ```typescript
   // 添加 playPromiseRef 管理 play() Promise
   const playPromiseRef = useRef<Promise<void> | null>(null)
   
   const play = () => {
     playPromiseRef.current = video.play().catch(error => {
       if (error.name !== 'AbortError') {
         console.warn('Play failed:', error)
       }
     })
   }
   
   const stop = async () => {
     if (playPromiseRef.current) {
       await playPromiseRef.current.catch(() => {})
       playPromiseRef.current = null
     }
     video.pause()
   }
   ```

2. **Motion Photo 优雅降级**
   ```typescript
   // 提取失败时不抛出错误，而是显示静态图片
   if (!extractedVideoUrl) {
     console.info('Motion Photo video extraction failed, falling back to static image')
     resolve() // 成功（只是没有视频）
     return
   }
   ```

3. **详细的调试信息**
   ```typescript
   console.debug('[motion-photo] Debug info:', {
     imageUrl,
     offset,
     size,
     extractedSize: blob.size,
     totalSize: arrayBuffer.byteLength,
   })
   ```

---

## 最佳实践

### 1. Builder 配置

```typescript
// builder.config.ts
export default defineBuilderConfig(() => ({
  system: {
    processing: {
      enableLivePhotoDetection: true,  // 启用 Live Photo 检测
      digestSuffixLength: 8,            // ID 摘要长度
    },
  },
}))
```

### 2. 文件命名规范

**Live Photo**：
```
✅ 正确：
IMG_1234.HEIC
IMG_1234.MOV

❌ 错误：
IMG_1234.HEIC
IMG_1234_video.MOV  // 文件名不匹配
```

**Motion Photo**：
```
✅ 正确：
PXL_20250113_120000.jpg  (包含 MotionPhoto=1 EXIF)

❌ 错误：
photo.jpg  (没有 MotionPhoto 标记)
```

### 3. 存储优化

**推荐**：
- 使用支持 Range Request 的服务器（Nginx、S3、CDN）
- 配置 CORS 允许 Range 头
- 启用 Gzip/Brotli 压缩

**Nginx 配置**：
```nginx
location /photos/ {
    # 启用 Range Request
    add_header Accept-Ranges bytes;
    
    # CORS 配置
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Headers "Range";
    add_header Access-Control-Expose-Headers "Content-Range, Content-Length";
}
```

### 4. 错误处理

**分级日志**：
```typescript
// ❌ 不要全部用 console.error
console.error('[motion-photo] Extracted data is not a valid MP4')

// ✅ 使用合适的日志级别
console.warn('[motion-photo] Extracted data is not a valid MP4. This photo may not contain embedded video data.')
console.debug('[motion-photo] Debug info:', { ... })
console.info('[motion-photo] No valid video found, displaying as static photo')
```

**优雅降级**：
```typescript
// ❌ 不要抛出异常
if (!videoBlob) {
  throw new Error('Failed to extract video')
}

// ✅ 返回 null，UI 显示静态图片
if (!videoBlob) {
  console.info('Video extraction failed, falling back to static image')
  return null
}
```

### 5. 性能优化

**Range Request 优先**：
```typescript
// 优先使用 Range Request（只下载视频部分）
if (motionPhotoVideoSize && motionPhotoVideoSize > 0) {
  try {
    const videoBlob = await fetchVideoWithRange(imageUrl, offset, size)
    if (videoBlob) {
      return URL.createObjectURL(videoBlob)
    }
  } catch (rangeError) {
    // Fallback 到完整下载
  }
}
```

**Blob URL 管理**：
```typescript
// 清理不再使用的 Blob URL
export function revokeMotionPhotoVideoUrl(blobUrl: string): void {
  if (blobUrl.startsWith('blob:')) {
    URL.revokeObjectURL(blobUrl)
  }
}

// 在组件 unmount 时清理
useEffect(() => {
  return () => {
    if (blobUrl) {
      revokeMotionPhotoVideoUrl(blobUrl)
    }
  }
}, [blobUrl])
```

### 6. 类型安全

**使用 Sum Type**：
```typescript
// ✅ 强制穷举处理
type VideoSource
  = | { type: 'live-photo'; videoUrl: string }
    | { type: 'motion-photo'; imageUrl: string; offset: number; size?: number }
    | { type: 'none' }

function processVideo(videoSource: VideoSource) {
  if (videoSource.type === 'live-photo') {
    // TypeScript 知道这里有 videoUrl
    loadVideo(videoSource.videoUrl)
  } else if (videoSource.type === 'motion-photo') {
    // TypeScript 知道这里有 offset 和 size
    extractVideo(videoSource.imageUrl, videoSource.offset, videoSource.size)
  } else {
    // videoSource.type === 'none'
    // TypeScript 确保所有情况都处理了
  }
}
```

---

## 常见问题

### Q1: Motion Photo 提取失败

**原因**：
- 照片被编辑/压缩，视频部分被移除
- Manifest 中的 offset/size 不正确
- 服务器不支持 Range Request

**解决**：
1. 检查原始照片是否包含视频
2. 重新运行 `pnpm build:photos:force`
3. 检查服务器 Range Request 配置

### Q2: Live Photo 视频不播放

**原因**：
- MOV 转码失败
- 浏览器不支持 WebCodecs
- 视频文件损坏

**解决**：
1. 检查控制台错误信息
2. 确认浏览器支持 WebCodecs
3. 手动验证视频文件

### Q3: 冲突错误

**错误**：
```
❌ 检测到同时存在 Motion Photo 和 Live Photo
```

**原因**：
- 同一照片同时有嵌入视频和独立视频文件

**解决**：
1. 删除 `.MOV` 文件（保留 Motion Photo）
2. 或删除 EXIF 中的 Motion Photo 标记（保留 Live Photo）
3. 重新构建

### Q4: Range Request 不工作

**原因**：
- 服务器不支持 Range Request
- CORS 配置错误

**解决**：
1. 检查服务器响应头：`Accept-Ranges: bytes`
2. 检查 CORS：`Access-Control-Allow-Headers: Range`
3. 查看 Network 面板，Response Header

---

## 总结

### 核心要点

1. **两种格式**
   - Live Photo: 独立文件（HEIC + MOV）
   - Motion Photo: 嵌入文件（JPEG with MP4）

2. **Builder 检测**
   - Live Photo: 文件名匹配
   - Motion Photo: EXIF/XMP 元数据

3. **前端播放**
   - Live Photo: 加载独立视频，MOV 转码
   - Motion Photo: 提取嵌入视频，Range Request 优化

4. **错误处理**
   - 优雅降级：显示静态图片
   - AbortError 处理：管理 play() Promise
   - 详细日志：分级记录

5. **类型安全**
   - Sum Type：强制穷举处理
   - TypeScript：编译期类型检查

### 与 afilmory 保持同步

本项目的实现**完全参考 afilmory**：
- ✅ 相同的检测逻辑
- ✅ 相同的处理流程
- ✅ 相同的数据结构
- ✅ 额外的错误处理和优化

**未来更新**：
- 当 afilmory 更新 Live Photo/Motion Photo 逻辑时
- 查看 `/Users/suqingyao/workspace/forks/afilmory/packages/builder/src/photo/`
- 同步更新本项目代码

---

## 参考资料

### afilmory 源码

- **Builder 端**：
  - `packages/builder/src/photo/live-photo-handler.ts`
  - `packages/builder/src/photo/motion-photo-detector.ts`
  - `packages/builder/src/photo/image-pipeline.ts`

- **前端**：
  - `apps/web/src/lib/motion-photo-extractor.ts`
  - `apps/web/src/lib/image-loader-manager.ts`
  - `apps/web/src/modules/media/LivePhotoVideo.tsx`
  - `apps/web/src/modules/viewer/types.ts`

### 本项目文档

- `docs/BUILDER_QUICK_START.md` - Builder 快速开始
- `docs/MOTION_PHOTO_ERROR.md` - Motion Photo 错误修复
- `docs/VIDEO_PLAY_ABORT_ERROR.md` - 视频播放错误修复

### 规范文档

- [Motion Photo Format Specification](https://developer.android.com/media/platform/motion-photo-format)
- [MDN: HTMLMediaElement.play()](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play)
- [WebCodecs API](https://developer.mozilla.org/en-US/docs/Web/API/WebCodecs_API)

---

**文档版本**：1.0.0  
**最后更新**：2026-01-13  
**维护者**：afilmory team
