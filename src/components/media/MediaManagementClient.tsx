'use client';

import { useState, useCallback } from 'react';
import { useMedia } from '@/hooks/useMedia';
import { useUpload } from '@/hooks/useUpload';
import { MediaUploader } from '@/components/media/MediaUploader';
import { MediaSkeleton } from '@/components/media/MediaSkeleton';
import { MediaEmpty } from '@/components/media/MediaEmpty';
import { DeleteConfirmModal } from '@/components/media/DeleteConfirmModal';
import {
  Images,
  Film,
  Layers,
  RefreshCw,
  AlertCircle,
  ChevronDown,
  Copy,
  ExternalLink,
  Trash2,
  Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import axios from 'axios';

export function MediaManagementClient() {
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
  } = useMedia('');

  const { uploads, isUploading, uploadFiles } = useUpload('', refresh);

  const handleDeleteRequest = useCallback((id: string) => {
    setDeleteTarget(id);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await axios.delete(`/api/admin/media/${deleteTarget}`);
      toast.success('Media deleted successfully');
      refresh();
    } catch {
      toast.error('Failed to delete media');
    } finally {
      setDeleteLoading(false);
      setDeleteTarget(null);
    }
  }, [deleteTarget, refresh]);

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard');
  };

  return (
    <>
      <DeleteConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />

      <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Media Management</h1>
            <p className="text-zinc-500 mt-1 text-sm sm:text-base">Upload and organize your platform assets.</p>
          </div>
          <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-widest bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full w-fit">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
            {total} Items Stored
          </div>
        </div>

        {/* Uploader Section - Responsive Spacing */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl sm:rounded-[2rem] p-4 sm:p-8 backdrop-blur-md relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-600/20 border border-indigo-500/20 rounded-xl flex items-center justify-center shadow-inner">
                <Layers size={20} className="text-indigo-400" />
              </div>
              <h2 className="text-lg font-bold text-white">Upload Media</h2>
            </div>
            <MediaUploader uploads={uploads} isUploading={isUploading} onDrop={uploadFiles} />
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[100px] rounded-full -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-150" />
        </div>

        {/* Gallery Section */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Filter Tabs - Mobile Scrollable */}
            <div className="flex items-center gap-1.5 p-1 bg-zinc-900 border border-zinc-800 rounded-xl w-full sm:w-fit overflow-x-auto no-scrollbar">
              {[
                { label: 'All Media', value: 'ALL', icon: <Layers size={14} /> },
                { label: 'Images', value: 'IMAGE', icon: <Images size={14} /> },
                { label: 'Videos', value: 'VIDEO', icon: <Film size={14} /> },
              ].map((f) => (
                <button
                  key={f.value}
                  onClick={() => setTypeFilter(f.value as any)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap",
                    typeFilter === f.value
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                      : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
                  )}
                >
                  {f.icon}
                  {f.label}
                </button>
              ))}
            </div>
            
            <div className="flex items-center justify-between sm:justify-end gap-3">
              <div className="flex items-center gap-2 text-[10px] font-black text-zinc-600 uppercase tracking-widest md:hidden">
                 <Filter size={12} />
                 Filters Active
              </div>
              <button
                onClick={refresh}
                disabled={loading}
                className="p-2.5 text-zinc-500 hover:text-white bg-zinc-900 border border-zinc-800 rounded-xl transition-all disabled:opacity-50 hover:border-zinc-700 active:scale-95"
              >
                <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
              </button>
            </div>
          </div>

          {error ? (
            <div className="flex items-center gap-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl p-6 shadow-xl shadow-rose-500/5 animate-in zoom-in-95 duration-300">
              <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center flex-shrink-0">
                <AlertCircle size={24} />
              </div>
              <div>
                <h3 className="font-bold text-white">System Error</h3>
                <p className="text-sm opacity-80">{error}</p>
              </div>
            </div>
          ) : loading ? (
            <MediaSkeleton />
          ) : media.length === 0 ? (
            <MediaEmpty typeFilter={typeFilter} />
          ) : (
            <div className="space-y-10">
              {/* Responsive Grid System */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
                {media.map((item) => (
                  <div key={item._id} className="group relative bg-zinc-900 border border-zinc-800 rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden hover:border-indigo-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10">
                    <div className="aspect-[4/3] relative bg-zinc-800 overflow-hidden">
                       {item.mediaType === 'VIDEO' ? (
                        <div className="w-full h-full relative">
                          {item.thumbnailUrl ? (
                            <img src={item.thumbnailUrl} className="w-full h-full object-cover" alt="Video thumbnail" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                               <Film size={32} className="text-zinc-600" />
                            </div>
                          )}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                             <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 shadow-2xl transition-transform group-hover:scale-110">
                                <Film size={20} className="text-white fill-white ml-0.5" />
                             </div>
                          </div>
                        </div>
                       ) : (
                        <img src={item.secureUrl} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="Media" />
                       )}
                       
                       {/* Floating Type Badge */}
                       <div className="absolute top-4 left-4 z-20 pointer-events-none">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md border shadow-lg",
                            item.mediaType === 'VIDEO' ? "bg-purple-500/20 text-purple-300 border-purple-500/30" : "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
                          )}>
                            {item.mediaType}
                          </span>
                       </div>

                       {/* Action Overlay - Optimized for Touch & Desktop */}
                       <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
                          <button 
                            onClick={() => handleCopyUrl(item.secureUrl)}
                            className="w-11 h-11 bg-white/10 hover:bg-indigo-500 rounded-xl flex items-center justify-center text-white border border-white/20 transition-all hover:scale-110 hover:border-indigo-400 active:scale-95"
                            title="Copy URL"
                          >
                            <Copy size={20} />
                          </button>
                          <a 
                            href={item.secureUrl} 
                            target="_blank" 
                            className="w-11 h-11 bg-white/10 hover:bg-indigo-500 rounded-xl flex items-center justify-center text-white border border-white/20 transition-all hover:scale-110 hover:border-indigo-400 active:scale-95"
                            title="Open Link"
                          >
                            <ExternalLink size={20} />
                          </a>
                          <button 
                            onClick={() => handleDeleteRequest(item._id)}
                            className="w-11 h-11 bg-rose-500/20 hover:bg-rose-500 rounded-xl flex items-center justify-center text-rose-400 hover:text-white border border-rose-500/30 transition-all hover:scale-110 hover:border-rose-400 active:scale-95 shadow-lg"
                            title="Delete Media"
                          >
                            <Trash2 size={20} />
                          </button>
                       </div>
                    </div>
                    <div className="p-4 sm:p-5 flex items-center justify-between bg-zinc-900/80 backdrop-blur-sm border-t border-zinc-800/50">
                       <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{item.format} • {(item.size / 1024 / 1024).toFixed(1)} MB</span>
                          <span className="text-[10px] font-bold text-zinc-700 tracking-tight leading-none">{new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                       </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Button - Centered & Responsive */}
              {hasMore && (
                <div className="flex justify-center pt-6">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="group flex items-center gap-3 px-10 py-4 bg-zinc-900 border border-zinc-800 text-sm font-black text-white rounded-2xl hover:bg-indigo-600 hover:border-indigo-500 transition-all shadow-2xl active:scale-95 disabled:opacity-50"
                  >
                    {loadingMore ? (
                      <RefreshCw size={20} className="animate-spin text-indigo-400" />
                    ) : (
                      <>
                        Load More Content
                        <ChevronDown size={20} className="group-hover:translate-y-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
