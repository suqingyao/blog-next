#!/usr/bin/env tsx

import process from 'node:process';
import { loadBuilderConfig } from '../src/lib/builder/config/index.js';
import { AfilmoryBuilder } from '../src/lib/builder/index.js';
import { logger } from '../src/lib/builder/logger/index.js';
import 'dotenv-expand/config';

async function main() {
  try {
    // 加载配置
    const config = await loadBuilderConfig({
      cwd: process.cwd(),
    });

    logger.main.info('📸 开始构建照片库...');
    logger.main.info(`   存储提供商: ${config.user?.storage?.provider || 'local'}`);

    // 创建 builder 实例
    const builder = new AfilmoryBuilder(config);

    // 解析命令行参数
    const args = new Set(process.argv.slice(2));
    const isForce = args.has('--force');
    const isForceThumbnails = args.has('--force-thumbnails');

    if (args.has('--help') || args.has('-h')) {
      console.log(`
照片库构建工具

用法：
  pnpm build:photos                       # 增量构建
  pnpm build:photos --force               # 全量重建
  pnpm build:photos --force-thumbnails    # 强制重新生成缩略图

选项：
  --force              强制重新处理所有照片
  --force-thumbnails   强制重新生成缩略图
  --help, -h           显示帮助信息
      `);
      return;
    }

    // 执行构建
    const result = await builder.buildManifest({
      isForceMode: isForce,
      isForceManifest: isForce,
      isForceThumbnails,
    });

    logger.main.success('\n✅ 构建完成！');
    logger.main.info(`   新增: ${result.newCount} 张`);
    logger.main.info(`   处理: ${result.processedCount} 张`);
    logger.main.info(`   跳过: ${result.skippedCount} 张`);
    logger.main.info(`   删除: ${result.deletedCount} 张`);
    logger.main.info(`   总计: ${result.totalPhotos} 张`);

    if (!result.hasUpdates) {
      logger.main.info('\n📋 没有需要更新的照片');
    }
  }
  catch (error) {
    logger.main.error('❌ 构建失败:', error);
    process.exit(1);
  }
}

main();
