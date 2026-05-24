import BannerManagementClient from '@/components/admin/BannerManagementClient';
import dbConnect from '@/lib/mongodb';
import { mediaRepository } from '@/repositories/media.repository';
import { enforcePermission } from '@/lib/auth-utils';

export default async function BannerManagementPage() {
  // Enforce media_management permission
  await enforcePermission('media_management');

  await dbConnect();
  
  // Initially fetch some media, but the client will handle infinite scroll
  const { media } = await mediaRepository.findAll({ page: 1, limit: 50, type: 'ALL' });

  return (
    <div className="p-6 md:p-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">Banner Management</h1>
        <p className="text-zinc-400">Select which images and videos appear in the homepage hero carousel.</p>
      </div>

      <BannerManagementClient initialMedia={JSON.parse(JSON.stringify(media))} />
    </div>
  );
}
