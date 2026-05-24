import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import { bookingService } from '@/services/booking.service';
import { verifyApiPermission } from '@/lib/api-auth';

export async function GET(req: Request) {
  try {
    const { errorResponse } = await verifyApiPermission('bookings_management');
    if (errorResponse) return errorResponse;

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const service = searchParams.get('service') || '';

    await dbConnect();
    const result = await bookingService.getAllBookings(page, limit, search, status, service);
    
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
