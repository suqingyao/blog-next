import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs-extra';
import path from 'path';
import { getImage } from '@/models/photo.model';

export async function GET(
  req: NextRequest,
  { params }: { params: { image: string } }
) {
  const image = await getImage(params.image);

  if (!image) {
    return new NextResponse('Not Found', { status: 404 });
  }

  const fileBuffer = await fs.readFile(image);
  // 根据图片后缀设置 content-type
  const ext = path.extname(image).toLowerCase();
  let contentType = 'image/jpeg';
  if (ext === '.png') contentType = 'image/png';
  if (ext === '.webp') contentType = 'image/webp';

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable'
    }
  });
}
