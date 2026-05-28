import dbConnect from '@/lib/mongodb';
import { DashboardShell } from '@/components/admin/DashboardShell';
import { getAuthenticatedAdmin } from '@/lib/auth-utils';
import { Metadata } from 'next';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await dbConnect();
  // Enforce authentication for all admin dashboard routes
  const admin = await getAuthenticatedAdmin();

  return (
    <DashboardShell admin={admin}>
      {children}
    </DashboardShell>
  );
}
