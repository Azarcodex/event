import { NextRequest, NextResponse } from 'next/server';
import { verifyApiSuperAdmin } from '@/lib/api-auth';
import dbConnect from '@/lib/mongodb';
import SharedDocument from '@/models/SharedDocument';
import { deleteFromCloudinary } from '@/lib/cloudinary';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { errorResponse } = await verifyApiSuperAdmin();
    if (errorResponse) return errorResponse;

    // Await params if Next.js version requires it, App Router in later versions requires awaiting params
    // We can extract id securely. Wait, next.js 15+ needs await params. Since we don't know the exact version, it's safer to await it if it's a promise, but in Next 14 it's an object. 
    // We'll destructure directly but Next.js docs for newest versions suggest awaiting `params` if it's dynamic. Let's do `const { id } = await params;` just in case, but if it's an older Next.js it might fail. Actually, standard `params.id` works in Next 13-14. I'll just use `params.id`. Wait, Next.js agent rules say "This version has breaking changes — APIs, conventions... Read relevant guide... Heed deprecation notices". Next 15 App Router `params` is a Promise!
    // I will await params.id safely by doing `const resolvedParams = await params; const id = resolvedParams.id;`
    
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const body = await req.json();
    const { isEnabled } = body;

    if (typeof isEnabled !== 'boolean') {
      return NextResponse.json({ message: 'isEnabled must be a boolean' }, { status: 400 });
    }

    await dbConnect();
    const pdf = await SharedDocument.findByIdAndUpdate(
      id,
      { isEnabled },
      { new: true }
    );

    if (!pdf) {
      return NextResponse.json({ message: 'PDF not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'PDF status updated', pdf });
  } catch (error: any) {
    console.error('Error updating PDF status:', error);
    return NextResponse.json(
      { message: 'Failed to update PDF status', error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { errorResponse } = await verifyApiSuperAdmin();
    if (errorResponse) return errorResponse;

    const resolvedParams = await params;
    const { id } = resolvedParams;

    await dbConnect();
    const pdf = await SharedDocument.findById(id);

    if (!pdf) {
      return NextResponse.json({ message: 'PDF not found' }, { status: 404 });
    }

    // Delete from Cloudinary
    try {
      await deleteFromCloudinary(pdf.publicId, 'image'); // We uploaded as 'image'
    } catch (cloudinaryError) {
      console.error('Error deleting from Cloudinary:', cloudinaryError);
      // Proceed to delete from DB even if Cloudinary fails (e.g. already deleted manually)
    }

    await SharedDocument.findByIdAndDelete(id);

    return NextResponse.json({ message: 'PDF deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting PDF:', error);
    return NextResponse.json(
      { message: 'Failed to delete PDF', error: error.message },
      { status: 500 }
    );
  }
}
