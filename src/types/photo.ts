// Copied from afilmory/packages/builder/src/types/photo.ts
// Adapted to remove external dependencies

// 地理位置信息
export interface LocationInfo {
  latitude: number
  longitude: number
  country?: string
  city?: string
  locationName?: string
}

// 影调类型定义
export type ToneType = 'low-key' | 'high-key' | 'normal' | 'high-contrast'

// 影调分析结果
export interface ToneAnalysis {
  toneType: ToneType
  brightness: number // 0-100，平均亮度
  contrast: number // 0-100，对比度
  shadowRatio: number // 0-1，阴影区域占比
  highlightRatio: number // 0-1，高光区域占比
}

// Video source sum type: Live Photo or Motion Photo
export type VideoSource =
  | { type: 'live-photo'; videoUrl: string; s3Key: string }
  | { type: 'motion-photo'; offset: number; size?: number; presentationTimestamp?: number }

export interface PhotoInfo {
  title: string
  dateTaken: string
  tags: string[]
  description: string
}

export interface ImageMetadata {
  width: number
  height: number
  format: string
}

export interface PhotoManifestItem extends PhotoInfo {
  id: string
  originalUrl: string
  format: string
  thumbnailUrl: string
  thumbHash: string | null
  width: number
  height: number
  aspectRatio: number
  s3Key: string
  lastModified: string
  size: number
  digest?: string
  exif: PickedExif | null
  toneAnalysis: ToneAnalysis | null // 影调分析结果
  location: LocationInfo | null // 地理位置信息（反向地理编码）
  isHDR?: boolean
  // Video source (Live Photo or Motion Photo)
  video?: VideoSource
  // Extra fields for blog-next compatibility
  album?: string
  blurhash?: string | null
}

export interface PickedExif {
  // 时区和时间相关
  zone?: string
  tz?: string
  tzSource?: string

  // 基本相机信息
  Orientation?: number
  Make?: string
  Model?: string
  Software?: string
  Artist?: string
  Copyright?: string

  // 曝光相关
  ExposureTime?: string | number
  FNumber?: number
  ExposureProgram?: string
  ISO?: number
  ShutterSpeedValue?: string | number
  ApertureValue?: number
  BrightnessValue?: number
  ExposureCompensation?: number
  MaxApertureValue?: number

  // 时间偏移
  OffsetTime?: string
  OffsetTimeOriginal?: string
  OffsetTimeDigitized?: string

  // 光源和闪光灯
  LightSource?: string
  Flash?: string

  // 焦距相关
  FocalLength?: string
  FocalLengthIn35mmFormat?: string

  // 镜头相关
  LensMake?: string
  LensModel?: string

  // 颜色和拍摄模式
  ColorSpace?: string
  ExposureMode?: string
  SceneCaptureType?: string

  // 计算字段
  Aperture?: number
  ScaleFactor35efl?: number
  ShutterSpeed?: string | number
  LightValue?: number

  // 日期时间（处理后的 ISO 格式）
  DateTimeOriginal?: string
  DateTimeDigitized?: string

  // 图像尺寸
  ImageWidth?: number
  ImageHeight?: number

  MeteringMode?: any
  WhiteBalance?: any
  WBShiftAB?: any
  WBShiftGM?: any
  WhiteBalanceBias?: any

  FlashMeteringMode?: any
  SensingMethod?: any
  FocalPlaneXResolution?: any
  FocalPlaneYResolution?: any
  GPSAltitude?: any
  GPSLatitude?: any
  GPSLongitude?: any
  GPSAltitudeRef?: any
  GPSLatitudeRef?: any
  GPSLongitudeRef?: any

  // 富士胶片配方
  FujiRecipe?: any

  // HDR 相关
  MPImageType?: any
  UniformResourceName?: string

  // 评分
  Rating?: number
}

// Alias for easier import
export type PhotoManifest = PhotoManifestItem;
