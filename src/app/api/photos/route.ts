import { NextResponse } from 'next/server';
import { getOssPhotos } from '@/lib/oss';

export const GET = async () => {
  const photos = await getOssPhotos();

  return NextResponse.json({
    status: 200,
    data: {
      photos: Object.fromEntries(photos)
    }
  });
};
