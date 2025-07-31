import fs from 'fs-extra';
import path from 'path';
import fg from 'fast-glob';
import { fileURLToPath } from 'url';

// ES 模块中获取 __dirname 的方法
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 批量生成文章摘要的脚本
 * 检查所有MDX文章文件，为没有摘要的文章生成AI摘要
 */
export async function generateMissingSummaries() {
  try {
    console.log('🚀 开始检查并生成缺失的文章摘要...');

    // 获取所有文章文件
    const postFiles = await fg('posts/**/*.mdx');
    console.log(`📚 找到 ${postFiles.length} 篇文章`);

    // 获取已有的摘要文件
    const summaryDir = path.join(process.cwd(), 'posts', '.summaries');
    await fs.ensureDir(summaryDir);

    const existingSummaries = await fs.readdir(summaryDir);
    const existingSlugs = existingSummaries.map((file) =>
      file.replace('.txt', '')
    );

    console.log(`📝 已有 ${existingSummaries.length} 个摘要文件`);

    // 找出需要生成摘要的文章
    const missingPosts = [];

    for (const file of postFiles) {
      const slug = file.replace(/^posts\/(.+)\.mdx$/, '$1');
      if (!existingSlugs.includes(slug)) {
        missingPosts.push({ file, slug });
      }
    }

    console.log(`⚠️  需要生成摘要的文章: ${missingPosts.length} 篇`);

    if (missingPosts.length === 0) {
      console.log('✅ 所有文章都已有摘要！');
      return;
    }

    // 逐个生成摘要
    for (let i = 0; i < missingPosts.length; i++) {
      const { file, slug } = missingPosts[i];
      console.log(`\n📖 [${i + 1}/${missingPosts.length}] 正在处理: ${slug}`);

      try {
        // 读取文章内容
        const content = await fs.readFile(
          path.join(process.cwd(), file),
          'utf-8'
        );

        // 调用API生成摘要
        const response = await fetch('http://localhost:2323/api/ai/summary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ content })
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`❌ 生成摘要失败 (${response.status}): ${errorText}`);
          continue;
        }

        const data = await response.json();
        const summary = data.summary;

        if (!summary) {
          console.error('❌ API返回的摘要为空');
          continue;
        }

        // 检查摘要是否包含错误信息
        if (
          summary.includes('生成摘要时出错') ||
          summary.includes('无法生成AI摘要') ||
          summary.includes('生成AI摘要时出现错误') ||
          summary.includes('客户端请求超时') ||
          summary.includes('API请求超时')
        ) {
          console.error(`❌ 摘要包含错误信息，跳过保存: ${summary}`);
          continue;
        }

        // 保存摘要到文件
        const summaryPath = path.join(summaryDir, `${slug}.txt`);
        await fs.writeFile(summaryPath, summary, 'utf-8');

        console.log(`✅ 摘要已保存: ${slug}`);
        console.log(`📄 摘要内容: ${summary.substring(0, 100)}...`);

        // 添加延迟避免API限流
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`❌ 处理文章 ${slug} 时出错:`, error.message);
      }
    }

    console.log('\n🎉 批量摘要生成完成！');
  } catch (error) {
    console.error('❌ 脚本执行失败:', error);
    process.exit(1);
  }
}

/**
 * 检查开发服务器是否运行
 */
async function checkServer() {
  try {
    const response = await fetch('http://localhost:2323/api/ai/summary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content: 'test' })
    });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('🔍 检查开发服务器状态...');

  const serverRunning = await checkServer();
  if (!serverRunning) {
    console.error('❌ 开发服务器未运行！请先启动开发服务器: pnpm dev');
    process.exit(1);
  }

  console.log('✅ 开发服务器运行正常');
  await generateMissingSummaries();
}

// ES 模块中检查是否为主模块的方法
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
