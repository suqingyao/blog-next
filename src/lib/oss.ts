import OSS from 'ali-oss';

const client = new OSS({
  region: process.env.NEXT_PUBLIC_OSS_REGION!,
  accessKeyId: process.env.OSS_ACCESS_KEY_ID!,
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET!,
  bucket: process.env.NEXT_PUBLIC_OSS_BUCKET!
});

let ossPhotos: Map<string, string[]> | null = null;

export async function getOssPhotos() {
  if (ossPhotos && ossPhotos.size > 0) {
    return ossPhotos;
  }
  // 1. 获取所有一级文件夹名
  const rootResult = await client.list(
    {
      delimiter: '/',
      'max-keys': 1000
    },
    {
      timeout: 10000
    }
  );

  const folders = rootResult.prefixes || [];

  // 2. 遍历每个文件夹，获取图片
  const result: Map<string, string[]> = new Map();

  for (const folder of folders) {
    const folderResult = await client.list(
      {
        prefix: folder,
        delimiter: '',
        'max-keys': 1000
      },
      {
        timeout: 10000
      }
    );

    const images =
      folderResult.objects
        ?.filter((obj) => !obj.name.endsWith('/'))
        .map(
          (obj) =>
            `https://${process.env.NEXT_PUBLIC_OSS_BUCKET}.${process.env.NEXT_PUBLIC_OSS_REGION}.aliyuncs.com/${obj.name}`
        ) || [];

    // 去掉末尾的斜杠
    const folderName = folder.replace(/\/$/, '');
    result.set(folderName, images);
  }

  ossPhotos = result;

  return result;
}
