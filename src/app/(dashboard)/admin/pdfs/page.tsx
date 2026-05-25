import { PdfManagementClient } from '@/components/admin/PdfManagementClient';
import { enforceSuperAdmin } from '@/lib/auth-utils';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PDF Management | Admin Panel',
  description: 'Manage secure PDF sharing files.',
};

export default async function PdfManagementPage() {
  // Enforce superadmin role check server-side
  const admin = await enforceSuperAdmin();

  return <PdfManagementClient currentAdmin={admin} />;
}
