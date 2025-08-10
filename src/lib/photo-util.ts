import type { PhotoFile } from './photos';

export function photoUrlParser(url: string): PhotoFile {
  if (url.startsWith('/photos/')) {
    // 处理 /photos/album/name.jpg 格式 或者 photos/album/name.jpg 格式
    return {
      album: url.startsWith('/photos/') ? url.split('/')[2] : url.split('/')[1],
      name: url.split('/')[url.split('/').length - 1],
      url,
      absUrl: url,
    };
  }
  else {
    // 处理 album/name.jpg 格式 或者 /album/name.jpg 格式
    return {
      album: url.startsWith('/') ? url.split('/')[1] : url.split('/')[0],
      name: url.split('/')[url.split('/').length - 1],
      url,
      absUrl: `/photos/${url}`,
    };
  }
}

export function getPhotoId(url: string) {
  return photoUrlParser(url).name.split('.')[0];
}
