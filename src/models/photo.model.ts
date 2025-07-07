import path from 'node:path';
import fs from 'fs-extra';

const PHOTOS_DIR = path.join(process.cwd(), 'photos');

let memoedAlbumsMap = new Map<string, any>();
let memoedImagesMap = new Map<string, any>();

export async function getAllAlbums() {
  if (memoedAlbumsMap.size) {
    return memoedAlbumsMap;
  }

  const albums = await getAlbums();
  memoedAlbumsMap = albums;
  return albums;
}

export async function getImage(image: string) {
  if (memoedImagesMap.has(image)) {
    return memoedImagesMap.get(image);
  }

  const albums = await getAllAlbums();
  const allImagesMap = new Map<string, any>();
  for (const [album, images] of albums.entries()) {
    for (const image of images) {
      allImagesMap.set(image, path.join(PHOTOS_DIR, album, image));
    }
  }
  if (allImagesMap.has(image)) {
    const imagePath = allImagesMap.get(image);
    memoedImagesMap.set(image, imagePath);
    return imagePath;
  }
  return null;
}

export async function getAlbums() {
  const items = await fs.promises.readdir(PHOTOS_DIR, { withFileTypes: true });
  const albums = new Map<string, any>();
  for (const item of items) {
    if (item.isDirectory()) {
      const albumPath = path.join(PHOTOS_DIR, item.name);
      const files = await fs.promises.readdir(albumPath);
      const images = files.filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f));
      albums.set(item.name, images);
    }
  }
  return albums;
}

export async function getAlbum(album: string) {
  const albums = await getAllAlbums();
  return albums.get(album);
}
