'use client';

import { IMedia, PaginatedMedia } from '@/types/media';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Play, Check, X, Loader2, Image as ImageIcon } from 'lucide-react';
import api from '@/services/api';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useMedia } from '@/hooks/useMedia';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface BannerManagementClientProps {
  initialMedia: IMedia[];
}

export default function BannerManagementClient({ initialMedia }: BannerManagementClientProps) {
  const queryClient = useQueryClient();
  const { media, loading } = useMedia('', 'ALL');

  const toggleMutation = useMutation({
    mutationFn: async ({ mediaId, status }: { mediaId: string; status: boolean }) => {
      const response = await api.patch(`/admin/media/${mediaId}/hero`, { status });
      return response.data;
    },
    onMutate: async ({ mediaId, status }) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ['media'] });
      await queryClient.cancelQueries({ queryKey: ['media', 'hero'] });

      // Snapshot the previous value
      const previousMediaData = queryClient.getQueryData<any>(['media', '', 'ALL']);

      // Optimistically update to the new value using setQueriesData to catch all variations
      queryClient.setQueriesData({ queryKey: ['media'] }, (old: any) => {
        if (!old || !old.pages) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            media: page.media.map((item: IMedia) => 
              item._id === mediaId ? { ...item, isHeroBanner: status } : item
            )
          }))
        };
      });

      return { previousMediaData };
    },
    onError: (err, newTodo, context) => {
      // Rollback on error
      if (context?.previousMediaData) {
        queryClient.setQueriesData({ queryKey: ['media'] }, context.previousMediaData);
      }
      toast.error('Failed to update banner status');
    },
    onSettled: () => {
      // Invalidate queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['media'] });
    },
    onSuccess: (_, variables) => {
      toast.success(variables.status ? 'Added to Hero Banner' : 'Removed from Hero Banner');
    }
  });

  const handleToggleHero = (mediaId: string, currentStatus: boolean) => {
    toggleMutation.mutate({ mediaId, status: !currentStatus });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <AnimatePresence>
        {media.map((item: IMedia) => (
          <motion.div
            key={item._id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "group relative rounded-2xl overflow-hidden bg-zinc-900/50 border transition-all duration-500",
              item.isHeroBanner 
                ? "border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.15)]" 
                : "border-zinc-800 hover:border-zinc-700"
            )}
          >
            {/* Media Preview */}
            <div className="relative aspect-video w-full overflow-hidden bg-black">
              {item.mediaType === 'VIDEO' ? (
                <video
                  src={item.secureUrl}
                  className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                  muted
                  loop
                  playsInline
                  onMouseOver={(e) => {
                    const video = e.target as HTMLVideoElement;
                    video.play().catch(() => {});
                  }}
                  onMouseOut={(e) => {
                    const video = e.target as HTMLVideoElement;
                    video.pause();
                  }}
                />
              ) : (
                <Image
                  src={item.secureUrl}
                  alt="Media Preview"
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                />
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60" />

              {/* Status Badge */}
              <div className="absolute top-4 right-4 z-10">
                <motion.div 
                  layout
                  className={cn(
                    "px-3 py-1.5 rounded-full backdrop-blur-md border text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-xl transition-colors duration-500",
                    item.isHeroBanner 
                      ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400" 
                      : "bg-black/60 border-white/10 text-zinc-400"
                  )}
                >
                  {item.isHeroBanner ? (
                    <>
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,1)]" />
                      Visible In Hero
                    </>
                  ) : (
                    <>
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                      Not In Hero
                    </>
                  )}
                </motion.div>
              </div>

              {/* Type Indicator */}
              <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center">
                {item.mediaType === 'VIDEO' ? (
                  <Play size={12} className="text-white fill-white" />
                ) : (
                  <ImageIcon size={12} className="text-white" />
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="p-5 flex items-center justify-between bg-zinc-950/80 backdrop-blur-sm border-t border-white/5">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Action</span>
                <span className="text-sm font-medium text-zinc-300 truncate max-w-[120px]" title={item.publicId}>
                  {item.mediaType.toLowerCase()}
                </span>
              </div>
              
              <button
                onClick={() => handleToggleHero(item._id, item.isHeroBanner)}
                disabled={toggleMutation.isPending && toggleMutation.variables?.mediaId === item._id}
                className={cn(
                  "relative px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-2 overflow-hidden group/btn",
                  item.isHeroBanner 
                    ? "bg-zinc-800 text-zinc-300 hover:bg-rose-500/10 hover:text-rose-400 border border-zinc-700 hover:border-rose-500/30" 
                    : "bg-emerald-600/10 text-emerald-400 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]"
                )}
              >
                {toggleMutation.isPending && toggleMutation.variables?.mediaId === item._id ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : item.isHeroBanner ? (
                  <>
                    <X size={16} className="transition-transform group-hover/btn:rotate-90" />
                    Remove From Banner
                  </>
                ) : (
                  <>
                    <Check size={16} className="transition-transform group-hover/btn:scale-110" />
                    Show In Banner
                  </>
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      
      {loading && media.length === 0 && (
        <div className="col-span-full py-20 flex justify-center">
          <Loader2 size={40} className="text-emerald-500 animate-spin" />
        </div>
      )}
    </div>
  );
}
