import path from 'node:path';
import process from 'node:process';
import fs from 'fs-extra';
import sharp from 'sharp';

// 配置
const config = {
  inputDir: path.join(process.cwd(), 'public/photos'),
  outputDir: path.join(process.cwd(), 'public/photos'),
  metadataFile: path.join(process.cwd(), 'public/image-metadata.json'),
  sizes: [640, 828, 1080, 1920], // 响应式尺寸
  quality: {
    jpeg: 80,
    webp: 80,
    blur: 10, // blur placeholder quality
  },
  blurSize: 10, // blur placeholder 宽度
};

// 存储所有图片元数据
const imageMetadata = {};

function ensureDirSync(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * 生成 blur placeholder (base64)
 */
async function generateBlurPlaceholder(imagePath) {
  try {
    const buffer = await sharp(imagePath)
      .resize(config.blurSize, null, { withoutEnlargement: true })
      .jpeg({ quality: config.quality.blur })
      .toBuffer();

    return `data:image/jpeg;base64,${buffer.toString('base64')}`;
  }
  catch (error) {
    console.error(`Error generating blur for ${imagePath}:`, error.message);
    return null;
  }
}

/**
 * 生成 WebP 版本
 */
async function generateWebP(inputPath, outputPath, width = null) {
  const sharpInstance = sharp(inputPath);

  if (width) {
    sharpInstance.resize(width, null, { withoutEnlargement: true });
  }

  await sharpInstance
    .webp({ quality: config.quality.webp })
    .toFile(outputPath);
}

/**
 * 生成多尺寸版本
 */
async function generateResponsiveSizes(inputPath, outputDir, filename, ext) {
  const nameWithoutExt = path.basename(filename, ext);
  const results = {};

  // 获取原始图片尺寸
  const metadata = await sharp(inputPath).metadata();
  const originalWidth = metadata.width;

  for (const size of config.sizes) {
    // 跳过比原图更大的尺寸
    if (size > originalWidth)
      continue;

    const outputFilename = `${nameWithoutExt}-${size}w${ext}`;
    const outputPath = path.join(outputDir, outputFilename);

    // 生成压缩的 JPEG/PNG
    if (!fs.existsSync(outputPath)) {
      await sharp(inputPath)
        .resize(size, null, { withoutEnlargement: true })
        .jpeg({ quality: config.quality.jpeg })
        .toFile(outputPath);
      console.log(`  ✓ Generated ${size}w: ${outputFilename}`);
    }

    // 生成 WebP 版本
    const webpFilename = `${nameWithoutExt}-${size}w.webp`;
    const webpPath = path.join(outputDir, webpFilename);

    if (!fs.existsSync(webpPath)) {
      await generateWebP(inputPath, webpPath, size);
      console.log(`  ✓ Generated ${size}w WebP: ${webpFilename}`);
    }

    results[size] = {
      jpeg: `/photos/${path.relative(config.outputDir, outputPath)}`,
      webp: `/photos/${path.relative(config.outputDir, webpPath)}`,
    };
  }

  return results;
}

/**
 * 优化单张图片
 */
async function optimizeImage(inputPath, outputDir, relativePath) {
  const ext = path.extname(inputPath).toLowerCase();
  const filename = path.basename(inputPath);
  const nameWithoutExt = path.basename(filename, ext);

  if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
    return;
  }

  console.log(`\n📸 Processing: ${relativePath}`);

  try {
    // 1. 生成 blur placeholder
    const blurDataURL = await generateBlurPlaceholder(inputPath);

    // 2. 生成多尺寸版本（包括 WebP）
    const sizes = await generateResponsiveSizes(inputPath, outputDir, filename, ext);

    // 3. 生成原图的 WebP 版本
    const webpFilename = `${nameWithoutExt}.webp`;
    const webpPath = path.join(outputDir, webpFilename);

    if (!fs.existsSync(webpPath)) {
      await generateWebP(inputPath, webpPath);
      console.log(`  ✓ Generated full-size WebP: ${webpFilename}`);
    }

    // 4. 获取图片尺寸信息
    const metadata = await sharp(inputPath).metadata();

    // 5. 保存元数据
    const imageKey = `/photos/${relativePath}`;
    imageMetadata[imageKey] = {
      width: metadata.width,
      height: metadata.height,
      blurDataURL,
      webp: `/photos/${path.relative(config.outputDir, webpPath)}`,
      sizes,
    };

    console.log(`  ✅ Completed: ${relativePath}`);
  }
  catch (error) {
    console.error(`  ❌ Error processing ${relativePath}:`, error.message);
  }
}

/**
 * 递归处理目录
 */
async function processDirectory(srcDir, destDir, baseDir = srcDir) {
  ensureDirSync(destDir);

  const files = fs.readdirSync(srcDir);

  for (const file of files) {
    const inputPath = path.join(srcDir, file);
    const outputPath = path.join(destDir, file);
    const stat = fs.statSync(inputPath);

    if (stat.isDirectory()) {
      await processDirectory(inputPath, outputPath, baseDir);
    }
    else {
      const relativePath = path.relative(baseDir, inputPath);
      await optimizeImage(inputPath, destDir, relativePath);
    }
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 Starting image optimization...\n');
  console.log(`Input directory: ${config.inputDir}`);
  console.log(`Output directory: ${config.outputDir}`);
  console.log(`Sizes: ${config.sizes.join(', ')}`);
  console.log(`Quality: JPEG=${config.quality.jpeg}, WebP=${config.quality.webp}\n`);

  const startTime = Date.now();

  // 处理所有图片
  await processDirectory(config.inputDir, config.outputDir);

  // 保存元数据到 JSON 文件
  fs.writeJsonSync(config.metadataFile, imageMetadata, { spaces: 2 });
  console.log(`\n💾 Metadata saved to: ${config.metadataFile}`);

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  const imageCount = Object.keys(imageMetadata).length;

  console.log(`\n✨ Optimization complete!`);
  console.log(`   Processed ${imageCount} images in ${duration}s`);
  console.log(`\n📖 Usage:`);
  console.log(`   import imageMetadata from '@/public/image-metadata.json';`);
  console.log(`   const metadata = imageMetadata['/photos/your-image.jpg'];`);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
