import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { bookingService } from '@/services/booking.service';
import { ZodError } from 'zod';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    
    const booking = await bookingService.createBooking(body);
    
    // TODO: Send email notifications (Admin Alert + User Confirmation)
    // This would typically use a library like nodemailer or a service like Resend/SendGrid.
    
    return NextResponse.json(
      { message: 'Booking inquiry submitted successfully', data: booking },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Booking creation error:', error);
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: 'Validation failed', errors: error.issues },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
