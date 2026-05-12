'use client';

import { useState, useCallback } from 'react';
import { useMedia } from '@/hooks/useMedia';
import { useUpload } from '@/hooks/useUpload';
import { MediaUploader } from '@/components/media/MediaUploader';
import { MediaGrid } from '@/components/media/MediaGrid';
import { MediaSkeleton } from '@/components/media/MediaSkeleton';
import { MediaEmpty } from '@/components/media/MediaEmpty';
import { DeleteConfirmModal } from '@/components/media/DeleteConfirmModal';
import { IEvent } from '@/types/event';
import {
  ArrowLeft,
  Images,
  Film,
  Layers,
  RefreshCw,
  AlertCircle,
  ChevronDown,
  Calendar,
  MapPin,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface MediaPageClientProps {
  event: IEvent;
}

type FilterType = 'ALL' | 'IMAGE' | 'VIDEO';

const FILTERS: { label: string; value: FilterType; icon: React.ReactNode }[] = [
  { label: 'All', value: 'ALL', icon: <Layers size={14} /> },
  { label: 'Images', value: 'IMAGE', icon: <Images size={14} /> },
  { label: 'Videos', value: 'VIDEO', icon: <Film size={14} /> },
];

export function MediaPageClient({ event }: MediaPageClientProps) {
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const {
    media,
    total,
    loading,
    loadingMore,
    error,
    hasMore,
    typeFilter,
    setTypeFilter,
    loadMore,
    refresh,
    deleteMedia,
  } = useMedia(event._id);

  const { uploads, isUploading, uploadFiles } = useUpload(event._id, refresh);

  const handleDeleteRequest = useCallback((id: string) => {
    setDeleteTarget(id);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteMedia(deleteTarget);
      toast.success('Media deleted successfully');
    } catch {
      toast.error('Failed to delete media');
    } finally {
      setDeleteLoading(false);
      setDeleteTarget(null);
    }
  }, [deleteTarget, deleteMedia]);

  return (
    <>
      <DeleteConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />

      <div className="space-y-8">
        {/* Back nav */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin/events"
            className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            Events
          </Link>
          <span className="text-zinc-700">/</span>
          <span className="text-sm text-zinc-300 font-medium truncate max-w-xs">{event.name}</span>
        </div>

        {/* Event Header */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">{event.name}</h1>
              {event.description && (
                <p className="text-zinc-400 text-sm mt-1 max-w-2xl">{event.description}</p>
              )}
              <div className="flex flex-wrap items-center gap-4 mt-3">
                {event.date && (
                  <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                    <Calendar size={12} />
                    {new Date(event.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                )}
                {event.location && (
                  <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                    <MapPin size={12} />
                    {event.location}
                  </span>
                )}
              </div>
            </div>
            <div className="flex-shrink-0 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-center">
              <p className="text-2xl font-bold text-white">{total}</p>
              <p className="text-xs text-zinc-500 mt-0.5">Media files</p>
            </div>
          </div>
        </div>

        {/* Uploader */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-zinc-300 mb-4">Upload Media</h2>
          <MediaUploader uploads={uploads} isUploading={isUploading} onDrop={uploadFiles} />
        </div>

        {/* Gallery Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setTypeFilter(f.value)}
                className={cn(
                  'flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all',
                  typeFilter === f.value
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                    : 'text-zinc-400 hover:text-white bg-zinc-800/50 border border-transparent hover:border-zinc-700'
                )}
              >
                {f.icon}
                {f.label}
              </button>
            ))}
          </div>
          <button
            onClick={refresh}
            disabled={loading}
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Gallery */}
        {error ? (
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4 text-sm">
            <AlertCircle size={16} className="flex-shrink-0" />
            {error}
          </div>
        ) : loading ? (
          <MediaSkeleton />
        ) : media.length === 0 ? (
          <MediaEmpty typeFilter={typeFilter} />
        ) : (
          <>
            <MediaGrid media={media} onDelete={handleDeleteRequest} />

            {/* Load More */}
            {hasMore && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-sm font-medium text-zinc-300 rounded-xl transition-all disabled:opacity-50"
                >
                  {loadingMore ? (
                    <RefreshCw size={14} className="animate-spin" />
                  ) : (
                    <ChevronDown size={14} />
                  )}
                  Load more
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
