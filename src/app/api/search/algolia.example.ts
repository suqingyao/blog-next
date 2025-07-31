/**
 * Algolia 搜索 API 示例
 * 使用前请将此文件内容复制到 route.ts 中
 * 注意：需要先创建 src/lib/algolia.ts 文件
 */

import { NextRequest, NextResponse } from 'next/server';
// import { getSearchClient, algoliaConfig } from '@/lib/algolia';

// 类型定义
interface SearchHit {
  title: string;
  summary: string;
  slug: string;
  tags?: string[];
  createdTime: string;
  readingTime?: string;
  _highlightResult?: {
    title?: { value: string };
    summary?: { value: string };
  };
  _rankingInfo?: {
    nbTypos: number;
  };
}

interface SearchResult {
  hits: SearchHit[];
  nbHits: number;
  processingTimeMS: number;
  query: string;
}

interface PostData {
  title: string;
  summary: string;
  slug: string;
  tags: string[];
  createdTime: string;
  readingTime?: string;
  content: string;
  score?: number;
}

/**
 * 使用 Algolia 的搜索 API
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ results: [] });
    }

    // 检查是否启用 Algolia
    const useAlgolia = process.env.USE_ALGOLIA === 'true';

    if (!useAlgolia) {
      // 回退到本地搜索
      return fallbackToLocalSearch(query, limit);
    }

    // 使用 Algolia 搜索
    // const client = getSearchClient();
// 注意：实际使用时需要取消注释上面的代码并导入 getSearchClient 和 algoliaConfig

    // 模拟 Algolia 搜索结果（实际使用时请替换为真实的 Algolia 调用）
    const searchResult: SearchResult = {
      hits: [],
      nbHits: 0,
      processingTimeMS: 0,
      query: query
    };

    // 实际的 Algolia 搜索代码（取消注释使用）:
    /*
    const searchResult = await index.search(query, {
      hitsPerPage: limit,
      attributesToRetrieve: [
        'title',
        'summary',
        'slug',
        'tags',
        'createdTime',
        'readingTime'
      ],
      attributesToHighlight: [
        'title',
        'summary'
      ],
      highlightPreTag: '<mark class="bg-yellow-200 dark:bg-yellow-800 rounded px-1">',
      highlightPostTag: '</mark>'
    });
    */

    // 转换 Algolia 结果格式
    const results = searchResult.hits.map((hit: SearchHit) => ({
      title: hit._highlightResult?.title?.value || hit.title,
      summary: hit._highlightResult?.summary?.value || hit.summary,
      slug: hit.slug,
      tags: hit.tags || [],
      createdTime: hit.createdTime,
      readingTime: hit.readingTime,
      // Algolia 特有的相关性分数
      _score: hit._rankingInfo?.nbTypos || 0
    }));

    return NextResponse.json({
      results,
      total: searchResult.nbHits,
      processingTimeMS: searchResult.processingTimeMS,
      query: searchResult.query
    });
  } catch (error) {
    console.error('Algolia 搜索错误:', error);

    // 出错时回退到本地搜索
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '10');

    return fallbackToLocalSearch(query || '', limit);
  }
}

/**
 * 回退到本地搜索的函数
 */
async function fallbackToLocalSearch(query: string, limit: number) {
  try {
    // 这里是原有的本地搜索逻辑
    const fs = await import('fs');
    const path = await import('path');

    const searchIndexPath = path.join(
      process.cwd(),
      'public',
      'search-index.json'
    );

    if (!fs.existsSync(searchIndexPath)) {
      return NextResponse.json({
        results: [],
        error: '搜索索引不存在，请运行 pnpm generate:search-index'
      });
    }

    const searchIndex: PostData[] = JSON.parse(
      fs.readFileSync(searchIndexPath, 'utf-8')
    );

    const searchTerms = query
      .toLowerCase()
      .split(' ')
      .filter((term) => term.length > 0);

    const results = searchIndex
      .map((post: PostData) => {
        let score = 0;
        const titleLower = post.title.toLowerCase();
        const summaryLower = post.summary.toLowerCase();
        const contentLower = post.content.toLowerCase();
        const tagsLower = post.tags.map((tag: string) => tag.toLowerCase());

        searchTerms.forEach((term) => {
          if (titleLower.includes(term)) score += 10;
          if (summaryLower.includes(term)) score += 5;
          if (contentLower.includes(term)) score += 1;
          if (tagsLower.some((tag: string) => tag.includes(term))) score += 8;
        });

        return { ...post, score };
      })
      .filter((post: PostData & { score: number }) => post.score > 0)
      .sort(
        (a: PostData & { score: number }, b: PostData & { score: number }) =>
          b.score - a.score
      )
      .slice(0, limit)
      .map(({ score, ...post }: PostData & { score: number }) => post);

    return NextResponse.json({
      results,
      total: results.length,
      fallback: true
    });
  } catch (error) {
    console.error('本地搜索错误:', error);
    return NextResponse.json({ error: '搜索服务暂时不可用' }, { status: 500 });
  }
}
