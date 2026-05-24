import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import { adminService } from '@/services/admin.service';

export interface AuthResult {
  errorResponse: NextResponse | null;
  admin: any;
}

export async function verifyApiAuth(): Promise<AuthResult> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token) {
      return {
        errorResponse: NextResponse.json({ message: 'Unauthorized: Session missing' }, { status: 401 }),
        admin: null,
      };
    }

    await dbConnect();
    const admin = await adminService.getMe(token);

    if (!admin) {
      return {
        errorResponse: NextResponse.json({ message: 'Unauthorized: Admin not found' }, { status: 401 }),
        admin: null,
      };
    }

    if (admin.status === 'inactive') {
      return {
        errorResponse: NextResponse.json({ message: 'Forbidden: Account is inactive' }, { status: 403 }),
        admin: null,
      };
    }

    return { errorResponse: null, admin };
  } catch (error: any) {
    return {
      errorResponse: NextResponse.json({ message: 'Internal Server Error' }, { status: 500 }),
      admin: null,
    };
  }
}

export async function verifyApiPermission(
  permission: 'media_management' | 'bookings_management'
): Promise<AuthResult> {
  const { errorResponse, admin } = await verifyApiAuth();
  if (errorResponse) return { errorResponse, admin: null };

  // Superadmin bypasses all permission checks
  if (admin.role === 'superadmin') {
    return { errorResponse: null, admin };
  }

  const hasPermission = admin.permissions?.includes(permission);
  if (!hasPermission) {
    return {
      errorResponse: NextResponse.json({ message: 'Forbidden: Insufficient permissions' }, { status: 403 }),
      admin: null,
    };
  }

  return { errorResponse: null, admin };
}

export async function verifyApiSuperAdmin(): Promise<AuthResult> {
  const { errorResponse, admin } = await verifyApiAuth();
  if (errorResponse) return { errorResponse, admin: null };

  if (admin.role !== 'superadmin') {
    return {
      errorResponse: NextResponse.json({ message: 'Forbidden: Super Admin access required' }, { status: 403 }),
      admin: null,
    };
  }

  return { errorResponse: null, admin };
}
