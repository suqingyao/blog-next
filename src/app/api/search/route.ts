import type { NextRequest } from 'next/server';
import path from 'node:path';
import process from 'node:process';
import fs from 'fs-extra';
import { NextResponse } from 'next/server';
import { consoleLog } from '@/lib/console';

/**
 * 搜索API端点
 * 提供文章搜索功能
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase().trim();
    const limit = Number.parseInt(searchParams.get('limit') || '10');

    // 读取搜索索引
    const indexPath = path.join(process.cwd(), 'public', 'search-index.json');

    if (!await fs.pathExists(indexPath)) {
      return NextResponse.json(
        { error: 'Search index not found' },
        { status: 404 },
      );
    }

    const searchIndex = await fs.readJson(indexPath);

    // 如果没有查询参数，返回最新的文章
    if (!query) {
      return NextResponse.json({
        results: searchIndex.slice(0, limit),
        total: searchIndex.length,
        query: '',
      });
    }

    // 执行搜索
    const results = searchIndex.filter((item: any) => {
      const searchText = item.searchText || '';
      const title = (item.title || '').toLowerCase();
      const summary = (item.summary || '').toLowerCase();

      // 多种匹配策略
      return (
        title.includes(query)
        || summary.includes(query)
        || searchText.includes(query)
        || (item.tags && item.tags.some((tag: string) =>
          tag.toLowerCase().includes(query),
        ))
      );
    });

    // 按相关性排序（标题匹配优先）
    results.sort((a: any, b: any) => {
      const aTitle = (a.title || '').toLowerCase();
      const bTitle = (b.title || '').toLowerCase();

      const aTitleMatch = aTitle.includes(query);
      const bTitleMatch = bTitle.includes(query);

      if (aTitleMatch && !bTitleMatch)
        return -1;
      if (!aTitleMatch && bTitleMatch)
        return 1;

      // 如果都匹配标题，按创建时间排序
      return new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime();
    });

    return NextResponse.json({
      results: results.slice(0, limit),
      total: results.length,
      query,
    });
  }
  catch (error) {
    consoleLog('ERROR', 'Search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
