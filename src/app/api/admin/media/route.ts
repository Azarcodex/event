import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { mediaService } from '@/services/media.service';
import { mediaQuerySchema } from '@/lib/validators/media.validator';
import { verifyApiPermission } from '@/lib/api-auth';

export async function GET(req: Request) {
  try {
    const { errorResponse } = await verifyApiPermission('media_management');
    if (errorResponse) return errorResponse;

    await dbConnect();
    const { searchParams } = new URL(req.url);

    const parsed = mediaQuerySchema.safeParse({
      page: searchParams.get('page') ?? '1',
      limit: searchParams.get('limit') ?? '20',
      type: searchParams.get('type') ?? 'ALL',
    });

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Invalid query params', errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const result = await mediaService.getAllMedia(parsed.data);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { errorResponse } = await verifyApiPermission('media_management');
    if (errorResponse) return errorResponse;

    await dbConnect();

    const contentType = req.headers.get('content-type') ?? '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { message: 'Content-Type must be multipart/form-data' },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { message: 'No file provided' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = file.type;

    const media = await mediaService.upload(buffer, mimeType);

    return NextResponse.json({ media }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Upload failed' },
      { status: 500 }
    );
  }
}
