import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { reviewService } from '@/services/review.service';
import { verifyApiPermission } from '@/lib/api-auth';

export async function GET() {
  try {
    const { errorResponse } = await verifyApiPermission('bookings_management');
    if (errorResponse) return errorResponse;

    await dbConnect();
    const reviews = await reviewService.getAllReviews();
    return NextResponse.json({ reviews }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
