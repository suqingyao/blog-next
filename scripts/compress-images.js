import path from 'node:path';
import process from 'node:process';
import fs from 'fs-extra';
import sharp from 'sharp';

// 配置输入和输出目录
const inputDir = path.join(process.cwd(), 'src/assets/photos'); // 原始照片目录
const outputDir = path.join(process.cwd(), 'public/photos'); // 压缩后照片目录

function ensureDirSync(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function compressImage(inputPath, outputPath) {
  const ext = path.extname(inputPath).toLowerCase();
  let pipeline = sharp(inputPath).resize({
    width: 1920,
    withoutEnlargement: true,
  });
  if (ext === '.png') {
    pipeline = pipeline.png({ quality: 80, compressionLevel: 8 });
  }
  else if (ext === '.webp') {
    pipeline = pipeline.webp({ quality: 80 });
  }
  else {
    pipeline = pipeline.jpeg({ quality: 80 });
  }
  return pipeline.toFile(outputPath);
}

function walkAndCompress(srcDir, destDir) {
  ensureDirSync(destDir);
  fs.readdirSync(srcDir).forEach((file) => {
    const inputPath = path.join(srcDir, file);
    const outputPath = path.join(destDir, file);
    const stat = fs.statSync(inputPath);
    if (stat.isDirectory()) {
      walkAndCompress(inputPath, outputPath);
    }
    else {
      const ext = path.extname(file).toLowerCase();
      if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext))
        return;
      if (fs.existsSync(outputPath)) {
        console.log(`Skip (exists): ${outputPath}`);
        return;
      }
      compressImage(inputPath, outputPath)
        .then(() => console.log(`Compressed: ${outputPath}`))
        .catch(err => console.error(`Error compressing ${inputPath}:`, err));
    }
  });
}

walkAndCompress(inputDir, outputDir);
