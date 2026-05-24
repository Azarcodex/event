import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { bookingService } from '@/services/booking.service';
import { verifyApiPermission } from '@/lib/api-auth';
import { BOOKING_STATUSES, BOOKING_SERVICES } from '@/types/booking';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { errorResponse } = await verifyApiPermission('bookings_management');
    if (errorResponse) return errorResponse;

    const { id } = await params;
    await dbConnect();
    const booking = await bookingService.getBookingById(id);
    
    return NextResponse.json(booking, { status: 200 });
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
    await bookingService.deleteBooking(id);
    
    return NextResponse.json({ message: 'Booking deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { errorResponse } = await verifyApiPermission('bookings_management');
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const body = await req.json();
    const { status, services } = body;

    const updateData: any = {};

    if (status !== undefined) {
      if (!BOOKING_STATUSES.includes(status)) {
        return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
      }
      updateData.status = status;
    }

    if (services !== undefined) {
      if (!Array.isArray(services) || services.some(s => !BOOKING_SERVICES.includes(s as any))) {
        return NextResponse.json({ message: 'Invalid services' }, { status: 400 });
      }
      updateData.services = services;
    }

    await dbConnect();
    const updatedBooking = await bookingService.updateBooking(id, updateData);

    return NextResponse.json(updatedBooking, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
