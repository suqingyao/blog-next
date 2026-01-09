import { Buffer } from 'node:buffer';
import path from 'node:path';
import process from 'node:process';
import { encode as encodeBlurhash } from 'blurhash';
import exifr from 'exifr';
import fs from 'fs-extra';
import sharp from 'sharp';
import { rgbaToThumbHash } from 'thumbhash';

// Configuration
const config = {
  inputDir: path.join(process.cwd(), 'src/assets/photos'),
  outputDir: path.join(process.cwd(), 'public/photos'),
  thumbnailDir: path.join(process.cwd(), 'public/thumbnails'),
  manifestFile: path.join(process.cwd(), 'photos-manifest.json'),
  gpsConfigFile: path.join(process.cwd(), 'scripts/gps-config.json'),
  manifestVersion: 'v10', // Afilmory format version
  thumbnailSize: { width: 400, height: 400 },
  maxPhotoSize: 1440,
  quality: 85,
  jpegQuality: 85,
};

// Load GPS config (optional)
let gpsConfig = {};
try {
  if (fs.existsSync(config.gpsConfigFile)) {
    gpsConfig = fs.readJsonSync(config.gpsConfigFile);
    console.log('📍 GPS config loaded');
  }
}
catch {
  console.log('⚠️  No GPS config found, will only use EXIF GPS data');
}

// Current manifest data
let existingManifest = null;
let existingManifestMap = new Map();

// Load existing manifest if exists
function loadExistingManifest() {
  try {
    if (fs.existsSync(config.manifestFile)) {
      existingManifest = fs.readJsonSync(config.manifestFile);
      if (existingManifest.data) {
        existingManifest.data.forEach((item) => {
          existingManifestMap.set(item.s3Key, item);
        });
        console.log(`📚 Loaded ${existingManifest.data.length} photos from existing manifest\n`);
      }
      return existingManifest;
    }
  }
  catch (error) {
    console.warn('⚠️  Failed to load existing manifest:', error.message);
  }
  return null;
}

// Check if file needs processing (based on mtime)
function needsUpdate(s3Key, fileStat) {
  const existingItem = existingManifestMap.get(s3Key);
  if (!existingItem)
    return true;

  const existingModified = new Date(existingItem.lastModified);
  const fileModified = fileStat.mtime;

  return fileModified > existingModified;
}

// Ensure directory exists
function ensureDirSync(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Encode image to blurhash
 */
async function encodeBlurhashFromBuffer(imageBuffer) {
  try {
    const { data, info } = await sharp(imageBuffer)
      .raw()
      .ensureAlpha()
      .resize(32, 32, { fit: 'inside' })
      .toBuffer({ resolveWithObject: true });

    return encodeBlurhash(new Uint8ClampedArray(data), info.width, info.height, 4, 4);
  }
  catch (error) {
    console.error('  ❌ Error generating blurhash:', error.message);
    return null;
  }
}

/**
 * Encode image to thumbhash
 */
async function encodeThumbhashFromBuffer(imageBuffer) {
  try {
    const { data, info } = await sharp(imageBuffer)
      .raw()
      .ensureAlpha()
      .resize(100, 100, { fit: 'inside' })
      .toBuffer({ resolveWithObject: true });

    const binaryThumbHash = rgbaToThumbHash(info.width, info.height, new Uint8Array(data));
    return Buffer.from(binaryThumbHash).toString('base64');
  }
  catch (error) {
    console.error('  ❌ Error generating thumbhash:', error.message);
    return null;
  }
}

/**
 * Get GPS info from EXIF or config
 */
async function getGpsInfo(inputPath, relativePath) {
  try {
    // 1. Try EXIF first
    const exifGps = await exifr.gps(inputPath);
    if (exifGps && exifGps.latitude && exifGps.longitude) {
      return {
        latitude: exifGps.latitude,
        longitude: exifGps.longitude,
      };
    }

    // 2. Try GPS config as fallback
    const albumName = path.dirname(relativePath).split(path.sep)[0];
    if (gpsConfig[albumName] && gpsConfig[albumName].defaultGps) {
      return gpsConfig[albumName].defaultGps;
    }
  }
  catch (error) {
    console.warn(`  ⚠️  Error reading GPS for ${relativePath}:`, error.message);
  }
  return null;
}

/**
 * Get EXIF info from image
 */
async function getExifInfo(inputPath) {
  try {
    const exif = await exifr.parse(inputPath, {
      // Basic camera info
      pick: [
        'Make',
        'Model',
        'Software',
        'Orientation',
        // Exposure settings
        'ISO',
        'ISOSpeedRatings',
        'FNumber',
        'ApertureValue',
        'ExposureTime',
        'ShutterSpeedValue',
        'ExposureCompensation',
        'ExposureMode',
        'ExposureProgram',
        // Lens info
        'LensModel',
        'LensMake',
        'FocalLength',
        'FocalLengthIn35mmFormat',
        // Date
        'DateTimeOriginal',
        'CreateDate',
        'ModifyDate',
        // White balance
        'WhiteBalance',
        // Flash
        'Flash',
        // GPS (will be extracted separately)
        'GPSLatitude',
        'GPSLongitude',
        'GPSAltitude',
      ],
    });

    return exif || null;
  }
  catch (error) {
    console.warn(`  ⚠️  Error reading EXIF for ${inputPath}:`, error.message);
    return null;
  }
}

/**
 * Generate thumbnail
 */
async function generateThumbnail(inputBuffer, outputPath) {
  try {
    await sharp(inputBuffer)
      .resize(config.thumbnailSize.width, config.thumbnailSize.height, {
        fit: 'cover',
        position: 'center',
      })
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(outputPath);
    return true;
  }
  catch (error) {
    console.error('  ❌ Error generating thumbnail:', error.message);
    return false;
  }
}

/**
 * Optimize and copy photo to public directory
 */
async function optimizePhoto(inputBuffer, outputPath) {
  try {
    const metadata = await sharp(inputBuffer).metadata();
    let pipeline = sharp(inputBuffer);

    // Resize if too large
    if (metadata.width > config.maxPhotoSize || metadata.height > config.maxPhotoSize) {
      pipeline = pipeline.resize(config.maxPhotoSize, config.maxPhotoSize, {
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    // Compress based on format
    if (metadata.format === 'png') {
      pipeline = pipeline.png({ quality: 100, compressionLevel: 9 });
    }
    else if (metadata.format === 'webp') {
      pipeline = pipeline.webp({ quality: config.quality });
    }
    else {
      pipeline = pipeline.jpeg({ quality: config.jpegQuality, mozjpeg: true });
    }

    await pipeline.toFile(outputPath);
    return await sharp(outputPath).metadata();
  }
  catch (error) {
    console.error('  ❌ Error optimizing photo:', error.message);
    return null;
  }
}

/**
 * Process single photo
 */
async function processPhoto(inputPath, relativePath, fileStat) {
  const ext = path.extname(inputPath).toLowerCase();

  // Only process supported image formats
  if (!['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif'].includes(ext)) {
    return null;
  }

  const s3Key = relativePath.replace(/\\/g, '/'); // Normalize path separators
  const photoId = s3Key.replace(/[./\\]/g, '-');
  const albumName = path.dirname(relativePath).split(path.sep)[0];

  // Check if needs update (incremental processing)
  if (!needsUpdate(s3Key, fileStat)) {
    console.log(`⏭️  Skipping (unchanged): ${relativePath}`);
    return existingManifestMap.get(s3Key); // Return existing item
  }

  console.log(`\n📸 Processing: ${relativePath}`);

  try {
    // Read input file
    const inputBuffer = await fs.readFile(inputPath);

    // Generate paths
    const outputPhotoPath = path.join(config.outputDir, relativePath);
    const thumbnailFilename = `${photoId}.jpg`;
    const thumbnailPath = path.join(config.thumbnailDir, thumbnailFilename);

    ensureDirSync(path.dirname(outputPhotoPath));
    ensureDirSync(config.thumbnailDir);

    // Optimize photo
    const optimizedMetadata = await optimizePhoto(inputBuffer, outputPhotoPath);
    if (!optimizedMetadata) {
      throw new Error('Failed to optimize photo');
    }

    // Generate thumbnail
    await generateThumbnail(inputBuffer, thumbnailPath);

    // Generate blurhash and thumbhash
    const blurhash = await encodeBlurhashFromBuffer(inputBuffer);
    const thumbHash = await encodeThumbhashFromBuffer(inputBuffer);

    // Extract EXIF
    const exif = await getExifInfo(inputPath);

    // Extract GPS
    const gps = await getGpsInfo(inputPath, relativePath);

    // Determine date taken
    let dateTaken = new Date().toISOString();
    if (exif?.DateTimeOriginal) {
      dateTaken = exif.DateTimeOriginal instanceof Date
        ? exif.DateTimeOriginal.toISOString()
        : new Date(exif.DateTimeOriginal).toISOString();
    }
    else if (exif?.CreateDate) {
      dateTaken = exif.CreateDate instanceof Date
        ? exif.CreateDate.toISOString()
        : new Date(exif.CreateDate).toISOString();
    }

    // Build photo manifest item (afilmory format)
    const photo = {
      id: photoId,
      s3Key,
      originalUrl: `/photos/${s3Key}`,
      thumbnailUrl: `/thumbnails/${thumbnailFilename}`,
      format: ext.replace('.', ''),
      width: optimizedMetadata.width,
      height: optimizedMetadata.height,
      aspectRatio: Number((optimizedMetadata.width / optimizedMetadata.height).toFixed(4)),
      size: fileStat.size,
      lastModified: fileStat.mtime.toISOString(),

      // Photo info
      title: path.basename(relativePath, ext),
      dateTaken,
      tags: [albumName],
      description: '',

      // Technical data
      exif,
      location: gps,
      toneAnalysis: null, // Can be added later if needed

      // Placeholders
      thumbHash,
      blurhash, // Legacy field for compatibility
    };

    console.log(`  ✅ ${optimizedMetadata.width}x${optimizedMetadata.height} ${gps ? '📍' : ''} ${exif ? '📷' : ''}`);

    return photo;
  }
  catch (error) {
    console.error(`  ❌ Error processing ${relativePath}:`, error.message);
    return null;
  }
}

/**
 * Extract unique cameras from photos
 */
function extractCameras(photos) {
  const cameraMap = new Map();

  photos.forEach((photo) => {
    if (photo.exif?.Make && photo.exif?.Model) {
      const key = `${photo.exif.Make}-${photo.exif.Model}`;
      if (!cameraMap.has(key)) {
        cameraMap.set(key, {
          make: photo.exif.Make,
          model: photo.exif.Model,
          displayName: `${photo.exif.Make} ${photo.exif.Model}`,
        });
      }
    }
  });

  return Array.from(cameraMap.values());
}

/**
 * Extract unique lenses from photos
 */
function extractLenses(photos) {
  const lensMap = new Map();

  photos.forEach((photo) => {
    if (photo.exif?.LensModel) {
      const key = photo.exif.LensModel;
      if (!lensMap.has(key)) {
        lensMap.set(key, {
          make: photo.exif.LensMake || undefined,
          model: photo.exif.LensModel,
          displayName: photo.exif.LensModel,
        });
      }
    }
  });

  return Array.from(lensMap.values());
}

/**
 * Recursively scan directory and process photos
 */
async function scanDirectory(dir, baseDir = dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const photos = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Recursively scan subdirectories
      const subPhotos = await scanDirectory(fullPath, baseDir);
      photos.push(...subPhotos);
    }
    else if (entry.isFile()) {
      // Get relative path from base directory
      const relativePath = path.relative(baseDir, fullPath);
      const stat = await fs.stat(fullPath);

      // Process photo
      const photo = await processPhoto(fullPath, relativePath, stat);
      if (photo) {
        photos.push(photo);
      }
    }
  }

  return photos;
}

/**
 * Save manifest to JSON file
 */
async function saveManifest(photos, cameras, lenses) {
  // Sort by date taken (newest first)
  const sortedPhotos = photos.sort((a, b) =>
    new Date(b.dateTaken).getTime() - new Date(a.dateTaken).getTime(),
  );

  const manifest = {
    version: config.manifestVersion,
    data: sortedPhotos,
    cameras,
    lenses,
  };

  await fs.writeJson(config.manifestFile, manifest, { spaces: 2 });
  console.log(`\n✅ Manifest saved to: ${config.manifestFile}`);
  console.log(`   📷 ${photos.length} photos`);
  console.log(`   🎥 ${cameras.length} cameras`);
  console.log(`   🔍 ${lenses.length} lenses`);
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting manifest generation from src/assets/photos...\n');

  const startTime = Date.now();

  // Load existing manifest for incremental updates
  loadExistingManifest();

  // Ensure output directories exist
  ensureDirSync(config.outputDir);
  ensureDirSync(config.thumbnailDir);

  // Scan and process all photos
  const photos = await scanDirectory(config.inputDir);

  if (photos.length === 0) {
    console.error('\n❌ No photos found in src/assets/photos/');
    process.exit(1);
  }

  // Extract metadata
  const cameras = extractCameras(photos);
  const lenses = extractLenses(photos);

  // Save manifest
  await saveManifest(photos, cameras, lenses);

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`\n🎉 Done in ${duration}s\n`);
}

// Run
main().catch((error) => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
