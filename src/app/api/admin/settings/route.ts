import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { adminService } from '@/services/admin.service';
import { updateProfileSchema } from '@/lib/validators/settings.validator';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';

export async function PATCH(req: Request) {
  try {
    await dbConnect();
    
    // Auth check
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (!token) throw new Error('Unauthorized');
    
    const decoded: any = await verifyToken(token);
    if (!decoded || !decoded.id) throw new Error('Unauthorized');

    const body = await req.json();
    const parsed = updateProfileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Validation Error', errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updatedAdmin = await adminService.updateProfile(decoded.id, parsed.data);
    
    return NextResponse.json({ admin: updatedAdmin }, { status: 200 });
  } catch (error: any) {
    const status = error.message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json(
      { message: error.message || 'Internal Server Error' },
      { status }
    );
  }
}
