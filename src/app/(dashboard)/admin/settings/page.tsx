import { cookies } from 'next/headers';
import { adminService } from '@/services/admin.service';
import { SettingsClient } from '@/components/admin/SettingsClient';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Settings — Admin Panel',
  description: 'Manage admin profile and security',
};

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;

  if (!token) {
    redirect('/admin/login');
  }

  const admin = await adminService.getMe(token);

  if (!admin) {
    redirect('/admin/login');
  }

  return <SettingsClient admin={admin as any} />;
}
