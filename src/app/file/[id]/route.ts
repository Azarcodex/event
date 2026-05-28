import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import SharedDocument from '@/models/SharedDocument';
import { generateSignedPdfUrl } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    // Check if valid ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.redirect(new URL('/file-error?reason=not_found', req.url));
    }

    await dbConnect();
    const pdf = await SharedDocument.findById(id);

    if (!pdf) {
      return NextResponse.redirect(new URL('/file-error?reason=not_found', req.url));
    }

    if (!pdf.isEnabled) {
      return NextResponse.redirect(new URL('/file-error?reason=access_denied', req.url));
    }

    // Generate signed URL
    const signedUrl = generateSignedPdfUrl(pdf.publicId);

    try {
      const response = await fetch(signedUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch from Cloudinary');
      }

      // Proxy the response to hide the Cloudinary URL
      return new NextResponse(response.body, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `inline; filename="${encodeURIComponent(pdf.title)}.pdf"`,
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
          'X-Robots-Tag': 'noindex, nofollow',
        },
      });
    } catch (fetchError) {
      console.error('Error proxying file:', fetchError);
      return NextResponse.redirect(new URL('/file-error?reason=server_error', req.url));
    }
  } catch (error) {
    console.error('Error serving file:', error);
    return NextResponse.redirect(new URL('/file-error?reason=server_error', req.url));
  }
}
