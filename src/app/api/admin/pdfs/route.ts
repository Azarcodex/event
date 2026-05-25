import { NextRequest, NextResponse } from 'next/server';
import { verifyApiSuperAdmin } from '@/lib/api-auth';
import dbConnect from '@/lib/mongodb';
import SharedDocument from '@/models/SharedDocument';
import { uploadPdfToCloudinary } from '@/lib/cloudinary';
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

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const title = formData.get('title') as string | null;

    if (!file || !title) {
      return NextResponse.json(
        { message: 'File and title are required' },
        { status: 400 }
      );
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { message: 'Only PDF files are allowed' },
        { status: 400 }
      );
    }

    // Read file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary securely
    const uploadResult = await uploadPdfToCloudinary(buffer, 'pdfs');

    // Save to database
    await dbConnect();
    const sharedPdf = await SharedDocument.create({
      title,
      publicId: uploadResult.public_id,
      secureUrl: uploadResult.secure_url,
      uploadedBy: admin.id,
      isEnabled: true,
    });

    return NextResponse.json(
      { message: 'PDF uploaded successfully', pdf: sharedPdf },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error uploading PDF:', error);
    return NextResponse.json(
      { message: 'Failed to upload PDF', error: error.message },
      { status: 500 }
    );
  }
}
