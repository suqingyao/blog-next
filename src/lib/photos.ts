import fg from 'fast-glob';

export interface PhotoFile {
  album: string; // 文件夹名
  name: string; // 文件名
  url: string; // 文件内容URL
}

export const getPhotosFromAssets = async (): Promise<PhotoFile[]> => {
  const photos: PhotoFile[] = [];

  const files = await fg.async('**/*.{jpg,jpeg,png,webp,gif}', {
    cwd: 'public/photos',
    absolute: false,
    ignore: ['node_modules', 'dist', 'build', 'public', 'public/**', 'public/*']
  });

  for (const file of files) {
    photos.push({
      album: file.split('/')[0],
      name: file.split('/')[1],
      url: file
    });
  }

  return photos;
};
