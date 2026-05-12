import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { adminService } from '@/services/admin.service';
import { loginSchema } from '@/lib/validators/auth.validator';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const parsedData = loginSchema.safeParse(body);
    
    if (!parsedData.success) {
      return NextResponse.json(
        { message: 'Validation Error', errors: parsedData.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { token, admin } = await adminService.login(parsedData.data);

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });

    return NextResponse.json(
      { message: 'Logged in successfully', admin },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Internal Server Error' },
      { status: 401 }
    );
  }
}
