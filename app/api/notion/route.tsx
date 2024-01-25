import { queryAllNotionPost } from '@/lib/notion';
import { NextResponse } from 'next/server';

export const GET = async () => {
  const data = await queryAllNotionPost();

  return NextResponse.json({
    data
  });
};
