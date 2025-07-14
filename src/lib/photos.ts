import {
  GITHUB_USERNAME,
  GITHUB_REPO_NAME,
  GITHUB_BRANCH,
  GITHUB_CDN
} from '@/constants';
import fg from 'fast-glob';

export interface PhotoFile {
  album: string; // 文件夹名
  name: string; // 文件名
  path: string; // 完整路径
  url: string; // GitHub API 文件内容URL
  cdnUrl?: string; // 直接可用的原图外链
}

const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO_NAME}/contents`;

export const getPhotos = async (): Promise<PhotoFile[]> => {
  const photos: PhotoFile[] = [];

  const fetchDir = async (dir: string = '', album: string = '') => {
    const response = await fetch(
      `${GITHUB_API_URL}/${dir}?ref=${GITHUB_BRANCH}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
        }
      }
    );
    if (!response.ok) {
      throw new Error('Failed to fetch photos');
    }
    const data = await response.json();
    for (const item of data) {
      if (item.type === 'dir') {
        await fetchDir(item.path, item.name);
      } else if (item.type === 'file') {
        if (/\.(jpg|jpeg|png|webp|gif)$/i.test(item.name)) {
          photos.push({
            album,
            name: item.name,
            path: item.path,
            url: item.download_url,
            cdnUrl: `${GITHUB_CDN}/${item.path}`
          });
        }
      }
    }
  };

  await fetchDir();

  return photos;
};

export const getPhotosFromAssets = async (): Promise<
  Omit<PhotoFile, 'cdnUrl'>[]
> => {
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
      path: file,
      url: file
    });
  }

  return photos;
};
