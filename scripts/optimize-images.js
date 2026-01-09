import path from 'node:path';
import process from 'node:process';
import { encode } from 'blurhash';
import exifr from 'exifr';
import fs from 'fs-extra';
import sharp from 'sharp';

// Configuration
const config = {
  inputDir: path.join(process.cwd(), 'src/assets/photos'),
  outputDir: path.join(process.cwd(), 'public/photos'),
  metadataFile: path.join(process.cwd(), 'public/image-metadata.json'),
  gpsConfigFile: path.join(process.cwd(), 'scripts/gps-config.json'),
  maxSize: 1440,
  quality: 80,
};

// Load GPS config
let gpsConfig = {};
try {
  gpsConfig = fs.readJsonSync(config.gpsConfigFile);
  console.log('📍 GPS config loaded\n');
}
catch {
  console.log('⚠️  No GPS config found, will only use EXIF GPS data\n');
}

// Store metadata
const imageMetadata = [];

function ensureDirSync(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Encode image to blurhash
 */
async function encodeBlurhash(imageBuffer) {
  try {
    const { data, info } = await sharp(imageBuffer)
      .raw()
      .ensureAlpha()
      .resize(32, 32, { fit: 'inside' })
      .toBuffer({ resolveWithObject: true });

    return encode(new Uint8ClampedArray(data), info.width, info.height, 4, 4);
  }
  catch (error) {
    console.error('Error generating blurhash:', error);
    return null;
  }
}

/**
 * Get GPS info
 */
async function getGpsInfo(inputPath, relativePath) {
  try {
    // 1. Try EXIF
    const exifGps = await exifr.gps(inputPath);
    if (exifGps) {
      return { lat: exifGps.latitude, lng: exifGps.longitude };
    }

    // 2. Try config
    const albumName = path.dirname(relativePath).split(path.sep)[0];
    if (gpsConfig[albumName] && gpsConfig[albumName].defaultGps) {
      return gpsConfig[albumName].defaultGps;
    }
  }
  catch (error) {
    console.warn(`Error reading GPS for ${relativePath}:`, error.message);
  }
  return null;
}

/**
 * Get EXIF info
 */
async function getExifInfo(inputPath) {
  try {
    const exif = await exifr.parse(inputPath, [
      'Make',
      'Model',
      'ISO',
      'FNumber',
      'ExposureTime',
      'FocalLength',
      'FocalLengthIn35mmFormat',
      'DateTimeOriginal',
    ]);
    return exif;
  }
  catch (error) {
    console.warn(`Error reading EXIF for ${inputPath}:`, error.message);
    return null;
  }
}

/**
 * Optimize single image
 */
async function optimizeImage(inputPath, outputDir, relativePath) {
  const ext = path.extname(inputPath).toLowerCase();

  if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
    return;
  }

  // Determine output path (mirroring input structure)
  // We'll keep the same filename but ensure it's in the output directory
  const outputPath = path.join(outputDir, relativePath);
  ensureDirSync(path.dirname(outputPath));

  console.log(`\n📸 Processing: ${relativePath}`);

  try {
    const inputBuffer = await fs.readFile(inputPath);
    const sharpInstance = sharp(inputBuffer);
    const metadata = await sharpInstance.metadata();

    // Resize and compress
    let pipeline = sharpInstance;

    if (metadata.width > config.maxSize || metadata.height > config.maxSize) {
      pipeline = pipeline.resize(config.maxSize, config.maxSize, {
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    // Determine format-specific options
    if (ext === '.png') {
      pipeline = pipeline.png({ quality: 100, compressionLevel: 9 }); // Lossless-ish
    }
    else if (ext === '.webp') {
      pipeline = pipeline.webp({ quality: config.quality });
    }
    else {
      pipeline = pipeline.jpeg({ quality: config.quality, mozjpeg: true });
    }

    await pipeline.toFile(outputPath);

    // Generate Blurhash
    const blurhash = await encodeBlurhash(inputBuffer);

    // Get final metadata
    const outputMetadata = await sharp(outputPath).metadata();
    const gps = await getGpsInfo(inputPath, relativePath);
    const exif = await getExifInfo(inputPath);

    // Create photo object for manifest (afilmory style)
    const photo = {
      id: relativePath.replace(/[./\\]/g, '-'), // Generate ID from path
      originalUrl: `/photos/${relativePath}`,
      thumbnailUrl: `/photos/${relativePath}`, // For now use same, optimizations later
      format: ext.replace('.', ''),
      width: outputMetadata.width,
      height: outputMetadata.height,
      aspectRatio: outputMetadata.width / outputMetadata.height,
      s3Key: relativePath,
      lastModified: new Date().toISOString(),
      size: outputMetadata.size,
      exif,
      location: gps ? {
        latitude: gps.lat,
        longitude: gps.lng,
      } : null,
      toneAnalysis: null,
      
      // Extra fields for blog-next compatibility (mapped to new fields or kept)
      filename: path.basename(relativePath),
      album: path.dirname(relativePath).split(path.sep)[0],
      blurhash,
      dateTaken: exif?.DateTimeOriginal ? exif.DateTimeOriginal.toISOString() : new Date().toISOString(),
      tags: [],
      title: path.basename(relativePath, ext),
      description: '',
    };

    imageMetadata.push(photo);

    console.log(`  ✅ Optimized: ${outputMetadata.width}x${outputMetadata.height} ${gps ? '📍' : ''} ${exif ? '📷' : ''}`);
  }
  catch (error) {
    console.error(`  ❌ Error:`, error.message);
  }
}

/**
 * Recursively process directory
 */
async function processDirectory(srcDir, destDir, baseDir = srcDir) {
  const files = await fs.readdir(srcDir);

  for (const file of files) {
    const inputPath = path.join(srcDir, file);
    const stat = await fs.stat(inputPath);

    if (stat.isDirectory()) {
      await processDirectory(inputPath, destDir, baseDir);
    }
    else {
      // Ignore hidden files or non-images handled in optimizeImage
      if (file.startsWith('.'))
        continue;

      const relativePath = path.relative(baseDir, inputPath);
      await optimizeImage(inputPath, destDir, relativePath);
    }
  }
}

async function main() {
  console.log('🚀 Starting image optimization (antfu.me style)...\n');

  // Clean output directory
  console.log(`Cleaning output directory: ${config.outputDir}`);
  fs.emptyDirSync(config.outputDir);

  await processDirectory(config.inputDir, config.outputDir);
  
  // Sort photos by date (newest first)
  imageMetadata.sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(b.date) - new Date(a.date);
  });

  // Save metadata
  fs.writeJsonSync(config.metadataFile, imageMetadata, { spaces: 2 });
  console.log(`\n💾 Metadata saved to: ${config.metadataFile}`);
  console.log(`✨ Processed ${imageMetadata.length} images.`);
}

main().catch(console.error);
