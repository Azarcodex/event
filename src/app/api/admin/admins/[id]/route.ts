import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { adminService } from '@/services/admin.service';
import { verifyApiSuperAdmin } from '@/lib/api-auth';
import { updateAdminSchema } from '@/lib/validators/admin.validator';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { errorResponse } = await verifyApiSuperAdmin();
    if (errorResponse) return errorResponse;

    const { id } = await params;
    await dbConnect();
    const body = await req.json();
    const parsed = updateAdminSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Validation Error', errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const admin = await adminService.updateAdmin(id, parsed.data);
    return NextResponse.json({ admin }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Internal Server Error' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { errorResponse, admin: currentAdmin } = await verifyApiSuperAdmin();
    if (errorResponse) return errorResponse;

    const { id } = await params;
    if (currentAdmin.id === id) {
      return NextResponse.json({ message: 'Cannot delete your own account' }, { status: 400 });
    }

    await dbConnect();
    const result = await adminService.deleteAdmin(id);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Internal Server Error' },
      { status: 400 }
    );
  }
}
