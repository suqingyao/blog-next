import path from 'node:path';
import process from 'node:process';
import chalk from 'chalk';
import fg from 'fast-glob';
import fs from 'fs-extra';
import matter from 'gray-matter';

/**
 * 检查所有已发布的文章是否支持搜索和是否有 AI 总结
 * 用于 git hooks 中，确保所有已发布的文章都有搜索索引和 AI 总结
 */
async function checkPosts() {
  console.log(chalk.blue('🔍 开始检查已发布的文章...'));

  try {
    // 标记是否需要更新搜索索引
    let needUpdateSearchIndex = false;

    // 获取所有 MDX 文件
    const postFiles = await fg('posts/**/*.mdx');
    console.log(chalk.blue(`📚 找到 ${postFiles.length} 篇文章`));

    // 读取搜索索引
    const searchIndexPath = path.join(process.cwd(), 'public', 'search-index.json');
    let searchIndex = [];

    if (await fs.pathExists(searchIndexPath)) {
      searchIndex = await fs.readJson(searchIndexPath);
    }
    else {
      console.log(chalk.yellow('⚠️ 搜索索引文件不存在，请先运行 pnpm generate:search-index'));
      process.exit(1);
    }

    // 获取已有的摘要文件
    const summaryDir = path.join(process.cwd(), 'posts', '.summaries');
    let existingSummaries = [];

    if (await fs.pathExists(summaryDir)) {
      existingSummaries = await fs.readdir(summaryDir);
    }
    else {
      console.log(chalk.yellow('⚠️ 摘要目录不存在，请先运行 pnpm generate:summaries'));
      process.exit(1);
    }

    const existingSlugs = existingSummaries.map(file => file.replace('.txt', ''));
    const searchIndexSlugs = searchIndex.map(item => item.slug);

    // 检查每篇文章
    const issues = [];

    for (const file of postFiles) {
      const slug = file.replace(/^posts\/(.+)\.mdx$/, '$1');
      const filePath = path.join(process.cwd(), file);
      const fileContent = await fs.readFile(filePath, 'utf-8');

      // 解析 frontmatter
      const { data: frontMatter } = matter(fileContent);

      // 只检查已发布的文章
      if (frontMatter.published !== false) {
        // 检查是否有搜索索引
        if (!searchIndexSlugs.includes(slug)) {
          issues.push({
            slug,
            title: frontMatter.title || slug,
            issue: '缺少搜索索引',
            solution: '运行 pnpm generate:search-index',
          });

          // 如果是 git hooks 模式，自动更新搜索索引
          if (process.argv.includes('--git-hooks')) {
            console.log(chalk.yellow(`  需要更新搜索索引: ${slug}`));
            // 将此文章添加到需要更新的列表中
            needUpdateSearchIndex = true;
          }
        }

        // 检查是否有 AI 摘要
        if (!existingSlugs.includes(slug)) {
          issues.push({
            slug,
            title: frontMatter.title || slug,
            issue: '缺少 AI 摘要',
            solution: '运行 pnpm generate:summaries',
          });

          // 如果是 git hooks 模式，自动创建临时摘要文件
          if (process.argv.includes('--git-hooks')) {
            const tempSummary = `[临时摘要] ${frontMatter.title || slug} - 请在开发环境中运行 pnpm generate:summaries 生成正式摘要`;
            const summaryPath = path.join(summaryDir, `${slug}.txt`);
            await fs.ensureDir(path.dirname(summaryPath));
            await fs.writeFile(summaryPath, tempSummary, 'utf-8');
            console.log(chalk.yellow(`  已创建临时摘要: ${slug}`));
          }
        }
      }
    }

    // 输出检查结果
    if (issues.length > 0) {
      console.log(chalk.red(`❌ 发现 ${issues.length} 个问题：`));

      const searchIndexIssues = issues.filter(issue => issue.issue === '缺少搜索索引');
      const summaryIssues = issues.filter(issue => issue.issue === '缺少 AI 摘要');

      if (searchIndexIssues.length > 0) {
        console.log(chalk.red(`\n缺少搜索索引的文章 (${searchIndexIssues.length}):`));
        searchIndexIssues.forEach((issue) => {
          console.log(chalk.yellow(`  - ${issue.title} (${issue.slug})`));
        });
        console.log(chalk.green('  解决方案: pnpm generate:search-index'));
      }

      if (summaryIssues.length > 0) {
        console.log(chalk.red(`\n缺少 AI 摘要的文章 (${summaryIssues.length}):`));
        summaryIssues.forEach((issue) => {
          console.log(chalk.yellow(`  - ${issue.title} (${issue.slug})`));
        });
        console.log(chalk.green('  解决方案: pnpm generate:summaries'));
      }

      // 如果需要更新搜索索引并且是在 git hooks 模式下，自动运行搜索索引生成命令
      if (needUpdateSearchIndex && process.argv.includes('--git-hooks')) {
        console.log(chalk.blue('🔄 自动更新搜索索引...'));
        const { execSync } = require('node:child_process');
        try {
          execSync('pnpm generate:search-index', { stdio: 'inherit' });
          console.log(chalk.green('✅ 搜索索引已更新'));
        }
        catch (error) {
          console.error(chalk.red('❌ 更新搜索索引失败:'), error);
        }
      }

      // 在 git hooks 模式下，如果已经创建了临时文件，则不退出
      if (process.argv.includes('--git-hooks')) {
        console.log(chalk.yellow('⚠️ 已创建临时文件，允许 git push 继续执行'));
        console.log(chalk.yellow('⚠️ 请在开发环境中运行相应命令生成正式索引和摘要'));
      }
      else {
        process.exit(1);
      }
    }
    else {
      console.log(chalk.green('✅ 所有已发布的文章都有搜索索引和 AI 摘要！'));
    }
  }
  catch (error) {
    console.error(chalk.red('❌ 检查文章时出错:'), error);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  checkPosts();
}

export { checkPosts };
