import path from 'node:path';
import process from 'node:process';
import fg from 'fast-glob';
import fs from 'fs-extra';

export interface PhotoFile {
  album: string; // 文件夹名
  name: string; // 文件名
  url: string; // 文件内容URL
  absUrl: string; // 文件绝对URL
}

let cache: PhotoFile[] = [];

/**
 * 获取图片列表
 * @param album 文件夹名，默认获取所有图片
 * @returns 图片列表
 */
export async function getPhotosFromAssets(album = ''): Promise<PhotoFile[]> {
  if (cache.length) {
    return album ? cache.filter(photo => photo.album === album) : cache;
  }
  const photos: PhotoFile[] = [];

  // 1. 优先尝试从 image-metadata.json 读取
  try {
    const metadataPath = path.join(process.cwd(), 'public/image-metadata.json');
    if (await fs.pathExists(metadataPath)) {
      const metadata = await fs.readJson(metadataPath);
      const photoPaths = Object.keys(metadata);

      for (const photoPath of photoPaths) {
        // photoPath 格式: /photos/album/name.ext
        const parts = photoPath.split('/');
        // parts: ['', 'photos', 'album', 'name.ext']
        if (parts.length >= 4) {
          const albumName = parts[2];
          const fileName = parts[3];

          photos.push({
            album: albumName,
            name: fileName,
            absUrl: photoPath,
            // 注意：这里 url 字段原逻辑是指向 public 下的相对路径，但现在 photoPath 已经是绝对路径
            // 为了保持兼容，我们去掉开头的 /photos/ ?
            // 不，原来的实现：file 是 "album/name.ext"，absUrl 是 "/photos/album/name.ext"
            // 所以 url 应该是 "album/name.ext"
            url: `${albumName}/${fileName}`,
          });
        }
      }

      cache = photos;
      return album ? photos.filter(photo => photo.album === album) : photos;
    }
  }
  catch (error) {
    console.error('Failed to load photos from metadata:', error);
  }

  // 2. 如果没有 metadata，回退到文件系统扫描（并增加过滤）
  const files = await fg.async('**/*.{jpg,jpeg,png,gif}', {
    cwd: `public/photos`,
    absolute: false,
    ignore: ['node_modules', 'dist', 'build'],
  });

  for (const file of files) {
    // 过滤掉优化生成的变体文件 (e.g., name-640w.jpg)
    if (/-\d+w\.(?:jpg|jpeg|png|gif)$/.test(file)) {
      continue;
    }

    photos.push({
      album: file.split('/')[0],
      name: file.split('/')[1],
      absUrl: `/photos/${file}`,
      url: file,
    });
  }
  cache = photos;
  return album ? photos.filter(photo => photo.album === album) : photos;
}
