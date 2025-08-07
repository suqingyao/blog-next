import RSS from 'rss';
import xss from 'xss';
import { getAllPosts } from '@/models/post.model';
import { OUR_DOMAIN, APP_NAME, APP_DESCRIPTION } from '@/constants/app';
import { consoleLog } from '@/lib/console';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

/**
 * 生成RSS feed
 */
export async function GET() {
  try {
    // 获取最新的文章
    const posts = await getAllPosts();
    const latestPosts = posts.slice(0, 20); // 限制为最新20篇文章

    const now = new Date();

    // 创建RSS feed实例
    const feed = new RSS({
      title: APP_NAME,
      description: APP_DESCRIPTION,
      site_url: OUR_DOMAIN || 'https://localhost:2323',
      feed_url: `${OUR_DOMAIN || 'https://localhost:2323'}/api/feed`,
      language: 'zh-CN',
      image_url: `${OUR_DOMAIN || 'https://localhost:2323'}/avatar.png`,
      generator: 'Next.js Blog RSS Generator',
      pubDate: now.toUTCString()
    });

    // 添加文章到feed
    latestPosts.forEach((post) => {
      const description = post.summary || post.excerpt || '暂无摘要';
      const content = generatePostContent(post);

      // 使用xss过滤文章标题
      const safeTitle = xss(post.title, {
        whiteList: {} // 标题不允许任何HTML标签
      });

      feed.item({
        title: safeTitle,
        url: `${OUR_DOMAIN}/posts/${post.slug}`,
        date: new Date(post.createdTime),
        description: content,
        categories: post.tags || []
      });
    });

    return new Response(feed.xml(), {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': `max-age=60, s-maxage=${revalidate}`,
        'CDN-Cache-Control': `max-age=${revalidate}`,
        'Cloudflare-CDN-Cache-Control': `max-age=${revalidate}`,
        'Vercel-CDN-Cache-Control': `max-age=${revalidate}`
      }
    });
  } catch (error) {
    consoleLog('ERROR', 'RSS生成失败:', error);
    return new Response('RSS生成失败', { status: 500 });
  }
}

/**
 * 生成文章内容用于RSS
 * 使用xss库过滤内容防止XSS攻击
 */
function generatePostContent(post: any): string {
  const summary = post.summary || post.excerpt || '暂无摘要';
  const postUrl = `${OUR_DOMAIN || 'https://localhost:2323'}/posts/${post.slug}`;

  // 使用xss过滤摘要内容
  const safeSummary = xss(summary, {
    whiteList: {
      p: [],
      br: [],
      strong: [],
      em: [],
      code: [],
      pre: [],
      blockquote: [],
      ul: [],
      ol: [],
      li: []
    }
  });

  const content = `
    <blockquote>
      该内容由博客RSS生成，可能存在排版问题，最佳体验请前往：
      <a href="${postUrl}">${postUrl}</a>
    </blockquote>
    <p>${safeSummary}</p>
    <p style="text-align: right;">
      <a href="${postUrl}#comments">看完了？说点什么呢</a>
    </p>
  `;

  return content;
}
