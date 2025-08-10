#!/usr/bin/env node

/**
 * Algolia 快速设置脚本
 * 帮助用户快速配置 Algolia 搜索集成
 */

import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 创建命令行接口
 */
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/**
 * 询问用户输入
 */
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

/**
 * 主设置函数
 */
async function setupAlgolia() {
  console.log('🔍 Algolia 搜索集成设置向导\n');

  console.log(
    '请先在 Algolia 控制台 (https://www.algolia.com/) 创建应用并获取以下信息:\n',
  );

  try {
    // 收集用户输入
    const appId = await askQuestion('请输入 Application ID: ');
    const writeApiKey = await askQuestion('请输入 Write API Key: ');
    const searchApiKey = await askQuestion('请输入 Search API Key: ');
    const indexName
      = (await askQuestion('请输入索引名称 (默认: blog_posts): '))
        || 'blog_posts';

    if (!appId || !writeApiKey || !searchApiKey || !indexName) {
      console.error('❌ 所有 API 密钥和索引名称都是必需的！');
      process.exit(1);
    }

    // 创建环境变量文件
    const envContent = `# Algolia 配置
ALGOLIA_APP_ID=${appId}
ALGOLIA_WRITE_API_KEY=${writeApiKey}
ALGOLIA_SEARCH_API_KEY=${searchApiKey}
ALGOLIA_INDEX_NAME=${indexName}

# 是否使用 Algolia（设置为 true 启用）
USE_ALGOLIA=false
`;

    const envPath = path.join(__dirname, '../.env.local');

    // 检查是否已存在 .env.local
    if (fs.existsSync(envPath)) {
      const overwrite = await askQuestion(
        '\n.env.local 文件已存在，是否覆盖？(y/N): ',
      );
      if (overwrite.toLowerCase() !== 'y') {
        console.log('\n请手动将以下内容添加到 .env.local 文件中:');
        console.log(`\n${envContent}`);
        rl.close();
        return;
      }
    }

    // 写入环境变量文件
    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ 环境变量配置已保存到 .env.local');

    // 检查是否需要安装依赖
    const packageJsonPath = path.join(__dirname, '../package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

    if (!packageJson.dependencies?.algoliasearch) {
      console.log('\n📦 检测到缺少 algoliasearch 依赖');
      const installDeps = await askQuestion('是否现在安装依赖？(Y/n): ');

      if (installDeps.toLowerCase() !== 'n') {
        console.log('\n正在安装依赖...');
        const { spawn } = await import('node:child_process');

        const installProcess = spawn('pnpm', ['add', 'algoliasearch'], {
          stdio: 'inherit',
          cwd: path.join(__dirname, '..'),
        });

        installProcess.on('close', (code) => {
          if (code === 0) {
            console.log('\n✅ 依赖安装完成');
            showNextSteps(indexName);
          }
          else {
            console.log(
              '\n❌ 依赖安装失败，请手动运行: pnpm add algoliasearch',
            );
            showNextSteps(indexName);
          }
          rl.close();
        });

        return;
      }
    }

    showNextSteps(indexName);
    rl.close();
  }
  catch (error) {
    console.error('\n❌ 设置过程中出现错误:', error.message);
    rl.close();
    process.exit(1);
  }
}

/**
 * 显示后续步骤
 */
function showNextSteps(indexName) {
  console.log('\n🎉 Algolia 基础配置完成！');
  console.log('\n📋 接下来的步骤:');
  console.log('\n1. 创建 Algolia 配置文件:');
  console.log('   参考 docs/ALGOLIA_INTEGRATION.md 中的 "索引管理" 部分');
  console.log('\n2. 生成并上传搜索索引:');
  console.log('   pnpm generate:search-index');
  console.log('   然后创建上传脚本并运行');
  console.log('\n3. 修改搜索 API:');
  console.log('   参考文档中的 "API 集成" 部分');
  console.log('\n4. 启用 Algolia 搜索:');
  console.log('   在 .env.local 中设置 USE_ALGOLIA=true');
  console.log('\n📖 详细文档: docs/ALGOLIA_INTEGRATION.md');
  console.log('\n💡 提示: 建议先在开发环境测试，确认无误后再部署到生产环境');
}

// 运行设置向导
if (import.meta.url === `file://${process.argv[1]}`) {
  setupAlgolia().catch(console.error);
}

export { setupAlgolia };
