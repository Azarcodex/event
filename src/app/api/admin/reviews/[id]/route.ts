import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { reviewService } from '@/services/review.service';
import { verifyApiPermission } from '@/lib/api-auth';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { errorResponse } = await verifyApiPermission('bookings_management');
    if (errorResponse) return errorResponse;

    const { id } = await params;
    await dbConnect();
    const review = await reviewService.approveReview(id);

    return NextResponse.json(
      { message: 'Review approved successfully', review },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { errorResponse } = await verifyApiPermission('bookings_management');
    if (errorResponse) return errorResponse;

    const { id } = await params;
    await dbConnect();
    await reviewService.deleteReview(id);

    return NextResponse.json(
      { message: 'Review deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
