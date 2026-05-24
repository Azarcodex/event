import { SettingsClient } from '@/components/admin/SettingsClient';
import { enforceSuperAdmin } from '@/lib/auth-utils';

export const metadata = {
  title: 'Settings — Admin Panel',
  description: 'Manage admin profile and security',
};

export default async function SettingsPage() {
  // Enforce Super Admin access
  const admin = await enforceSuperAdmin();

  return <SettingsClient admin={admin as any} />;
}
