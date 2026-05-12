import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { mediaService } from '@/services/media.service';

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ eventId: string; mediaId: string }> }
) {
  try {
    await dbConnect();
    const { mediaId } = await params;

    await mediaService.delete(mediaId);

    return NextResponse.json({ message: 'Media deleted successfully' }, { status: 200 });
  } catch (error: any) {
    const status = error.message === 'Media not found' ? 404 : 500;
    return NextResponse.json(
      { message: error.message || 'Internal Server Error' },
      { status }
    );
  }
}
