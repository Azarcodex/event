import { adminService } from '@/services/admin.service';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import { DashboardShell } from '@/components/admin/DashboardShell';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await dbConnect();
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  const admin = token ? await adminService.getMe(token) : null;

  return (
    <DashboardShell admin={admin}>
      {children}
    </DashboardShell>
  );
}
