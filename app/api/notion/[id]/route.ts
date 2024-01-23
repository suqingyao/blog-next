import { NextRequest, NextResponse } from 'next/server';
import { getNotionPostById } from '@/lib/notion';

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const id = params.id;
  try {
    const data = await getNotionPostById(id);

    return NextResponse.json({ data });
  } catch (error) {
    return new NextResponse('Page Found', { status: 400 });
  }
};
