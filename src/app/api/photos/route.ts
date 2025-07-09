import OSS from 'ali-oss';

const client = new OSS({
  region: process.env.NEXT_PUBLIC_OSS_REGION!,
  accessKeyId: process.env.OSS_ACCESS_KEY_ID!,
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET!,
  bucket: process.env.NEXT_PUBLIC_OSS_BUCKET!
});

export async function GET() {
  // 获取 photos/ 下所有图片
  const result = await client.list(
    {
      prefix: 'photos/',
      delimiter: '',
      'max-keys': 100,
      marker: '100'
    },
    {
      timeout: 10000
    }
  );

  // 生成图片公网链接
  const images =
    result.objects
      ?.filter((obj) => !obj.name.endsWith('/'))
      .map(
        (obj) =>
          `https://${process.env.NEXT_PUBLIC_OSS_BUCKET}.${process.env.NEXT_PUBLIC_OSS_REGION}.aliyuncs.com/${obj.name}`
      ) || [];

  return Response.json({ images });
}
