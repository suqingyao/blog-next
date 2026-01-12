export interface S3ObjectLike {
  Key?: string
  LastModified?: Date
  ETag?: string
  Size?: number
  StorageClass?: string
  [key: string]: unknown
}
