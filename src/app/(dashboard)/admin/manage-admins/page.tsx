import { ManageAdminsClient } from '@/components/admin/ManageAdminsClient';
import { enforceSuperAdmin } from '@/lib/auth-utils';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manage Admins | Admin Panel',
  description: 'Manage staff administrator permissions and active status.',
};

export default async function ManageAdminsPage() {
  // Enforce superadmin role check server-side
  const admin = await enforceSuperAdmin();

  return <ManageAdminsClient currentAdmin={admin} />;
}
