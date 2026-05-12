import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { adminService } from '@/services/admin.service';
import { registerSchema } from '@/lib/validators/auth.validator';

export async function POST(req: Request) {
  try {
    await dbConnect();
    
    const body = await req.json();
    const parsedData = registerSchema.safeParse(body);
    
    if (!parsedData.success) {
      return NextResponse.json(
        { message: 'Validation Error', errors: parsedData.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const admin = await adminService.register(parsedData.data);

    return NextResponse.json(
      { message: 'Admin registered successfully', admin },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
