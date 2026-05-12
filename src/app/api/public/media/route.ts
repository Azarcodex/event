import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { mediaRepository } from '@/repositories/media.repository';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const type = (searchParams.get('type') || 'ALL') as 'IMAGE' | 'VIDEO' | 'ALL';
    const isHero = searchParams.get('isHero') === 'true' ? true : undefined;

    const result = await mediaRepository.findAll({ 
      page, 
      limit, 
      type, 
      isHero: searchParams.get('isHero') !== null ? (searchParams.get('isHero') === 'true') : undefined
    });
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
