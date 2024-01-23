import { NextRequest, NextResponse } from 'next/server';
import { getAllNotionPost } from '@/lib/notion';

export const GET = async (req: NextRequest) => {
  const data = await getAllNotionPost();

  return NextResponse.json({
    data
  });
};
