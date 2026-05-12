'use client';

import { IMedia } from '@/types/media';
import { MediaCard } from './MediaCard';

interface MediaGridProps {
  media: IMedia[];
  onDelete: (id: string) => void;
}

export function MediaGrid({ media, onDelete }: MediaGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {media.map((item) => (
        <MediaCard key={item._id} media={item} onDelete={onDelete} />
      ))}
    </div>
  );
}
