import { NextRequest, NextResponse } from 'next/server';
import { verifyApiSuperAdmin } from '@/lib/api-auth';
import dbConnect from '@/lib/mongodb';
import SharedDocument from '@/models/SharedDocument';
import { z } from 'zod';

export async function GET() {
  try {
    const { errorResponse } = await verifyApiSuperAdmin();
    if (errorResponse) return errorResponse;

    await dbConnect();
    const pdfs = await SharedDocument.find()
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json(pdfs);
  } catch (error: any) {
    console.error('Error fetching PDFs:', error);
    return NextResponse.json({ message: 'Failed to fetch PDFs' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { errorResponse, admin } = await verifyApiSuperAdmin();
    if (errorResponse) return errorResponse;

    const body = await req.json();
    const { title, blobUrl } = body;

    if (!title || !blobUrl) {
      return NextResponse.json(
        { message: 'Title and Vercel Blob URL are required' },
        { status: 400 }
      );
    }

    // Save to database
    await dbConnect();
    const sharedPdf = await SharedDocument.create({
      title,
      publicId: blobUrl, // Store the Vercel Blob URL directly
      secureUrl: blobUrl, // Satisfy Mongoose validation
      uploadedBy: admin.id,
      isEnabled: true,
    });

    return NextResponse.json(
      { message: 'PDF saved successfully', pdf: sharedPdf },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error saving PDF:', error);
    return NextResponse.json(
      { message: 'Failed to save PDF', error: error.message },
      { status: 500 }
    );
  }
}

