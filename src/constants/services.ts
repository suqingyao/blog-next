/**
 * 第三方服务配置常量
 */

// Algolia 搜索服务配置
/** Algolia 应用 ID */
export const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID;

/** Algolia 搜索 API 密钥 */
export const ALGOLIA_SEARCH_API_KEY = process.env.ALGOLIA_SEARCH_API_KEY;

/** Algolia 写入 API 密钥 */
export const ALGOLIA_WRITE_API_KEY = process.env.ALGOLIA_WRITE_API_KEY;

/** Algolia 索引名称 */
export const ALGOLIA_INDEX_NAME = process.env.ALGOLIA_INDEX_NAME;

// OSS 对象存储服务配置
/** OSS 访问 URL 前缀 */
export const OSS_URL_PREFIX = `https://${process.env
  .NEXT_PUBLIC_OSS_BUCKET!}.${process.env
  .NEXT_PUBLIC_OSS_REGION!}.aliyuncs.com`;