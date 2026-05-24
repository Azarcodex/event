import { MediaManagementClient } from '@/components/media/MediaManagementClient';
import { enforcePermission } from '@/lib/auth-utils';

export const metadata = {
  title: 'Media Management — Admin Panel',
  description: 'Manage all platform images and videos',
};

export default async function MediaManagementPage() {
  // Enforce media_management permission
  await enforcePermission('media_management');

  return <MediaManagementClient />;
}
