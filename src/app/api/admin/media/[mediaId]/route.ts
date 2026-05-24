import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { mediaService } from '@/services/media.service';
import { verifyApiPermission } from '@/lib/api-auth';

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ mediaId: string }> }
) {
  try {
    const { errorResponse } = await verifyApiPermission('media_management');
    if (errorResponse) return errorResponse;

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
