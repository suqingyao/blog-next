import fg from 'fast-glob';

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

  const files = await fg.async('**/*.{jpg,jpeg,png,webp,gif}', {
    cwd: `public/photos`,
    absolute: false,
    ignore: ['node_modules', 'dist', 'build'],
  });

  for (const file of files) {
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
