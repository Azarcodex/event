import { MediaManagementClient } from '@/components/media/MediaManagementClient';

export const metadata = {
  title: 'Media Management — Admin Panel',
  description: 'Manage all platform images and videos',
};

export default function MediaManagementPage() {
  return <MediaManagementClient />;
}
