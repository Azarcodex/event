import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { mediaRepository } from '@/repositories/media.repository';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ mediaId: string }> }
) {
  try {
    await dbConnect();
    const { status } = await req.json();
    const { mediaId } = await params;

    if (typeof status !== 'boolean') {
      return NextResponse.json(
        { message: 'Status must be a boolean' },
        { status: 400 }
      );
    }

    const updatedMedia = await mediaRepository.toggleHero(mediaId, status);

    if (!updatedMedia) {
      return NextResponse.json(
        { message: 'Media not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedMedia, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
