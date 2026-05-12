import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { eventService } from '@/services/event.service';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    await dbConnect();
    const { eventId } = await params;
    const event = await eventService.getById(eventId);
    return NextResponse.json({ event }, { status: 200 });
  } catch (error: any) {
    const status = error.message === 'Event not found' ? 404 : 500;
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status });
  }
}
