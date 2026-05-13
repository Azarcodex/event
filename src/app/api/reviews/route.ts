import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { reviewService } from '@/services/review.service';
import { reviewSchema } from '@/lib/validators/review.validator';

export async function GET() {
  try {
    await dbConnect();
    const reviews = await reviewService.getApprovedReviews();
    return NextResponse.json({ reviews }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = reviewSchema.parse(body);

    await dbConnect();
    const review = await reviewService.submitReview(validatedData);

    return NextResponse.json(
      { message: 'Review submitted for approval', review },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { message: 'Validation error', errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
