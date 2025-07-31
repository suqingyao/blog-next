/**
 * Algolia 配置文件
 * 用于博客搜索功能的 Algolia 集成
 */

import { algoliasearch } from 'algoliasearch';
import {
  ALGOLIA_APP_ID,
  ALGOLIA_INDEX_NAME,
  ALGOLIA_SEARCH_API_KEY,
  ALGOLIA_WRITE_API_KEY
} from '@/constants';

// 类型定义
type SearchClient = ReturnType<typeof algoliasearch>;

// 环境变量配置
const algoliaConfig = {
  appId: ALGOLIA_APP_ID,
  writeApiKey: ALGOLIA_WRITE_API_KEY,
  searchApiKey: ALGOLIA_SEARCH_API_KEY,
  indexName: ALGOLIA_INDEX_NAME
};

// 管理员客户端（服务端使用，用于索引管理）
export const algoliaAdmin = algoliasearch(
  algoliaConfig.appId!,
  algoliaConfig.writeApiKey!
);

// 搜索客户端（前端使用，只读权限）
export const algoliaSearch = algoliasearch(
  algoliaConfig.appId!,
  algoliaConfig.searchApiKey!
);

/**
 * 获取管理客户端（用于数据上传和管理）
 * @returns Algolia 管理客户端实例
 */
export const getAdminClient = () => {
  return algoliaAdmin;
};

/**
 * 获取搜索客户端（用于前端搜索）
 * @returns Algolia 搜索客户端实例
 */
export const getSearchClient = () => {
  return algoliaSearch;
};

/**
 * Algolia 搜索配置选项
 * 用于配置搜索行为和结果展示
 */
export const searchOptions = {
  // 可搜索的属性（按重要性排序）
  searchableAttributes: [
    'title', // 标题权重最高
    'summary', // 摘要次之
    'content', // 内容权重较低
    'tags' // 标签
  ],
  // 用于分面搜索的属性
  attributesForFaceting: ['tags', 'createdTime'],
  // 自定义排序规则（按创建时间倒序）
  customRanking: ['desc(createdTime)'],
  // 搜索结果高亮标签
  highlightPreTag:
    '<mark class="bg-yellow-200 dark:bg-yellow-800 rounded px-1">',
  highlightPostTag: '</mark>',
  // 分页设置
  hitsPerPage: 10,
  // 最大分面值数量
  maxValuesPerFacet: 100,
  // 拼写错误容忍度
  minWordSizefor1Typo: 4,
  minWordSizefor2Typos: 8,
  // 数字标记不允许拼写错误
  allowTyposOnNumericTokens: false,
  // 结果去重
  distinct: true,
  attributeForDistinct: 'slug'
};

/**
 * 检查 Algolia 配置是否完整
 * @returns 配置是否有效
 */
export const isAlgoliaConfigured = (): boolean => {
  return !!(
    algoliaConfig.appId &&
    algoliaConfig.searchApiKey &&
    algoliaConfig.writeApiKey &&
    algoliaConfig.indexName
  );
};

/**
 * 获取 Algolia 配置状态
 * @returns 配置状态信息
 */
export const getAlgoliaStatus = () => {
  return {
    configured: isAlgoliaConfigured(),
    appId: !!algoliaConfig.appId,
    searchApiKey: !!algoliaConfig.searchApiKey,
    writeApiKey: !!algoliaConfig.writeApiKey,
    indexName: !!algoliaConfig.indexName
  };
};

export { algoliaConfig };
