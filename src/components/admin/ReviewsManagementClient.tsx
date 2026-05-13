'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminReviews, useApproveReview, useDeleteReview } from '@/hooks/useReviews';
import StarRating from '@/components/ui/StarRating';
import { Check, Trash2, Loader2, MessageSquare, Filter, Clock, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { IReview } from '@/types/review';

export default function ReviewsManagementClient() {
  const { data: reviews = [] as IReview[], isLoading } = useAdminReviews();
  const { mutate: approveReview, isPending: isApproving } = useApproveReview();
  const { mutate: deleteReview, isPending: isDeleting } = useDeleteReview();
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED'>('ALL');

  const filteredReviews = reviews.filter((review: IReview) => {
    if (filter === 'PENDING') return !review.isApproved;
    if (filter === 'APPROVED') return review.isApproved;
    return true;
  });

  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleApprove = (id: string) => {
    setProcessingId(id);
    approveReview(id, {
      onSettled: () => setProcessingId(null),
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this review?')) {
      setProcessingId(id);
      deleteReview(id, {
        onSettled: () => setProcessingId(null),
      });
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/50 p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-zinc-800/50 backdrop-blur-sm">
        <div className="flex flex-col xs:flex-row items-start xs:items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2 px-2">
            <Filter size={16} className="text-brand" />
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Filter</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'ALL', label: 'All', icon: MessageSquare },
              { id: 'PENDING', label: 'Pending', icon: Clock },
              { id: 'APPROVED', label: 'Approved', icon: CheckCircle },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setFilter(t.id as any)}
                className={cn(
                  "px-3 sm:px-4 py-2 rounded-xl text-[10px] sm:text-xs font-bold transition-all duration-300 flex items-center gap-2 border",
                  filter === t.id 
                    ? "bg-brand border-brand text-black shadow-[0_0_20px_rgba(16,185,129,0.2)]" 
                    : "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                )}
              >
                <t.icon size={12} className={cn("sm:w-3.5 sm:h-3.5")} />
                {t.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="hidden xs:block text-[10px] font-bold text-zinc-500 bg-zinc-950/50 px-3 py-1.5 rounded-lg border border-white/5 uppercase tracking-widest">
          {filteredReviews.length} Results
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 sm:gap-6">
        <AnimatePresence mode="popLayout">
          {filteredReviews.map((review: IReview) => (
            <motion.div
              key={review._id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cn(
                "group relative bg-zinc-900/30 border rounded-[2rem] p-6 sm:p-8 flex flex-col gap-5 sm:gap-6 transition-all duration-500 hover:bg-zinc-900/50",
                review.isApproved 
                  ? "border-emerald-500/10 hover:border-emerald-500/30 shadow-[0_10px_40px_-15px_rgba(16,185,129,0.05)]" 
                  : "border-zinc-800/50 hover:border-zinc-700 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.3)]"
              )}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="space-y-2">
                  <h3 className="text-lg sm:text-xl font-display font-bold text-white tracking-tight leading-tight group-hover:text-brand transition-colors">
                    {review.name}
                  </h3>
                  <div className="flex items-center gap-3">
                    <StarRating rating={review.rating} size={14} />
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest opacity-60">
                      {new Date(review.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                <div className={cn(
                  "px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border flex items-center gap-1.5 self-start",
                  review.isApproved 
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                    : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                )}>
                  <div className={cn(
                    "w-1 h-1 rounded-full",
                    review.isApproved ? "bg-emerald-400" : "bg-amber-400 animate-pulse"
                  )} />
                  {review.isApproved ? 'Approved' : 'Reviewing'}
                </div>
              </div>

              {/* Content */}
              <div className="relative">
                <div className="absolute -left-2 -top-2 text-3xl text-white/5 font-serif pointer-events-none">"</div>
                <p className="text-zinc-400 text-sm sm:text-base leading-relaxed italic relative z-10 line-clamp-6">
                  {review.description}
                </p>
              </div>

              {/* Actions */}
              <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between gap-4">
                <button
                  onClick={() => handleDelete(review._id)}
                  disabled={processingId === review._id}
                  title="Delete Review"
                  className="p-3 rounded-xl bg-rose-500/5 text-rose-500/50 hover:bg-rose-500 hover:text-white transition-all duration-300 border border-rose-500/10 hover:border-rose-500"
                >
                  {processingId === review._id && isDeleting ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Trash2 size={18} />
                  )}
                </button>

                {!review.isApproved && (
                  <button
                    onClick={() => handleApprove(review._id)}
                    disabled={processingId === review._id}
                    className="flex-1 px-6 py-3 rounded-xl bg-emerald-600/10 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all duration-300 border border-emerald-500/20 flex items-center justify-center gap-2 font-bold text-[10px] uppercase tracking-widest"
                  >
                    {processingId === review._id && isApproving ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <>
                        <Check size={16} />
                        Approve
                      </>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && filteredReviews.length === 0 && (
          <div className="col-span-full py-32 flex flex-col items-center gap-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-2 border-brand/20 border-t-brand animate-spin" />
              <Loader2 size={24} className="text-brand absolute inset-0 m-auto animate-pulse" />
            </div>
            <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[10px]">Syncing Reviews...</p>
          </div>
        )}

        {!isLoading && filteredReviews.length === 0 && (
          <div className="col-span-full py-24 flex flex-col items-center gap-6 bg-zinc-900/10 rounded-[3rem] border border-dashed border-zinc-800/50">
            <div className="w-20 h-20 bg-zinc-900/50 rounded-3xl flex items-center justify-center border border-zinc-800 text-zinc-700">
              <MessageSquare size={40} />
            </div>
            <div className="text-center space-y-2">
              <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">No reviews found</p>
              <p className="text-zinc-600 text-xs">Try adjusting your filters to see more results.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
