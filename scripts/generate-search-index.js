import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import fg from 'fast-glob';
import fs from 'fs-extra';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * 生成搜索索引
 * 提取文章的标题、摘要、标签等可搜索字段
 */
async function generateSearchIndex() {
  console.log('🔍 开始生成搜索索引...');

  try {
    // 获取所有MDX文件
    const postFiles = await fg('posts/**/*.mdx');
    console.log(`📚 找到 ${postFiles.length} 篇文章`);

    const searchIndex = [];

    for (const file of postFiles) {
      const slug = file.replace(/^posts\/(.+)\.mdx$/, '$1');
      const filePath = path.join(process.cwd(), file);
      const fileContent = await fs.readFile(filePath, 'utf-8');

      // 解析frontmatter和内容
      const { data: frontMatter, content } = matter(fileContent);

      // 读取AI摘要
      let summary = '';
      const summaryPath = path.join(process.cwd(), 'posts', '.summaries', `${slug}.txt`);
      if (await fs.pathExists(summaryPath)) {
        summary = await fs.readFile(summaryPath, 'utf-8');
        summary = summary.trim();
      }

      // 提取纯文本内容（移除MDX语法）
      const plainContent = content
        .replace(/---[\s\S]*?---/, '') // 移除frontmatter
        .replace(/<[^>]*>/g, '') // 移除HTML标签
        .replace(/```[\s\S]*?```/g, '') // 移除代码块
        .replace(/`[^`]*`/g, '') // 移除行内代码
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 移除链接，保留文本
        .replace(/[#*_~]/g, '') // 移除markdown标记
        .replace(/\s+/g, ' ') // 合并空白字符
        .trim();

      // 构建搜索索引项
      const indexItem = {
        slug,
        title: frontMatter.title || '',
        summary: summary || '',
        content: plainContent.substring(0, 500), // 只保留前500字符
        createdTime: frontMatter.createdTime || '',
        published: frontMatter.published !== false,
        tags: frontMatter.tags || [],
        // 用于搜索的组合文本
        searchText: [
          frontMatter.title || '',
          summary || '',
          plainContent.substring(0, 200),
        ].join(' ').toLowerCase(),
      };

      // 只包含已发布的文章
      if (indexItem.published) {
        searchIndex.push(indexItem);
      }

      console.log(`✅ 已处理: ${frontMatter.title || slug}`);
    }

    // 按创建时间排序
    searchIndex.sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime));

    // 保存搜索索引
    const outputPath = path.join(process.cwd(), 'public', 'search-index.json');
    await fs.ensureDir(path.dirname(outputPath));
    await fs.writeFile(outputPath, JSON.stringify(searchIndex, null, 2));

    console.log(`🎉 搜索索引生成完成！`);
    console.log(`📄 共包含 ${searchIndex.length} 篇文章`);
    console.log(`💾 索引文件: ${outputPath}`);
  }
  catch (error) {
    console.error('❌ 生成搜索索引失败:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  generateSearchIndex();
}

export { generateSearchIndex };
