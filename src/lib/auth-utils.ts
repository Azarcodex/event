import { cookies } from 'next/headers';
import { adminService } from '@/services/admin.service';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/mongodb';

export async function getAuthenticatedAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;

  if (!token) {
    redirect('/admin/login');
  }

  await dbConnect();
  const admin = await adminService.getMe(token);

  if (!admin) {
    redirect('/admin/login');
  }

  if (admin.status === 'inactive') {
    redirect('/admin/login');
  }

  return admin;
}

export async function enforcePermission(permission: 'media_management' | 'bookings_management') {
  const admin = await getAuthenticatedAdmin();

  if (admin.role === 'superadmin') {
    return admin;
  }

  const hasPermission = admin.permissions?.includes(permission);
  if (!hasPermission) {
    redirect('/admin/dashboard?error=unauthorized');
  }

  return admin;
}

export async function enforceSuperAdmin() {
  const admin = await getAuthenticatedAdmin();

  if (admin.role !== 'superadmin') {
    redirect('/admin/dashboard?error=unauthorized');
  }

  return admin;
}
