import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { eventService } from '@/services/event.service';
import { createEventSchema } from '@/lib/validators/media.validator';

export async function GET() {
  try {
    await dbConnect();
    const events = await eventService.getAll();
    return NextResponse.json({ events }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const parsed = createEventSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Validation Error', errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const event = await eventService.create(parsed.data);
    return NextResponse.json({ event }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
