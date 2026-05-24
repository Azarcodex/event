import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { adminService } from '@/services/admin.service';
import { verifyApiSuperAdmin } from '@/lib/api-auth';
import { createAdminSchema } from '@/lib/validators/admin.validator';

export async function GET() {
  try {
    const { errorResponse } = await verifyApiSuperAdmin();
    if (errorResponse) return errorResponse;

    await dbConnect();
    const admins = await adminService.getAllAdmins();
    return NextResponse.json({ admins }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { errorResponse } = await verifyApiSuperAdmin();
    if (errorResponse) return errorResponse;

    await dbConnect();
    const body = await req.json();
    const parsed = createAdminSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Validation Error', errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const admin = await adminService.createAdmin(parsed.data);
    return NextResponse.json({ admin }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Internal Server Error' },
      { status: 400 }
    );
  }
}
