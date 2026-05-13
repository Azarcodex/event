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
    <div className="space-y-8">
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-zinc-500" />
          <span className="text-sm font-bold text-zinc-400 uppercase tracking-widest mr-4">Filter By</span>
          <div className="flex gap-2">
            {[
              { id: 'ALL', label: 'All', icon: MessageSquare },
              { id: 'PENDING', label: 'Pending', icon: Clock },
              { id: 'APPROVED', label: 'Approved', icon: CheckCircle },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setFilter(t.id as any)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-2",
                  filter === t.id 
                    ? "bg-brand text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]" 
                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                )}
              >
                <t.icon size={14} />
                {t.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="text-xs font-medium text-zinc-500 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
          Total: {filteredReviews.length} Reviews
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredReviews.map((review: IReview) => (
            <motion.div
              key={review._id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cn(
                "group relative bg-zinc-900/40 border rounded-[2rem] p-8 flex flex-col gap-6 transition-all duration-500",
                review.isApproved 
                  ? "border-emerald-500/20 hover:border-emerald-500/40" 
                  : "border-zinc-800 hover:border-zinc-700 shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
              )}
            >
              {/* Header */}
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-xl font-display font-bold text-white tracking-tight">
                    {review.name}
                  </h3>
                  <div className="flex items-center gap-3">
                    <StarRating rating={review.rating} size={14} />
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className={cn(
                  "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-1.5",
                  review.isApproved 
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                    : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                )}>
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    review.isApproved ? "bg-emerald-400" : "bg-amber-400 animate-pulse"
                  )} />
                  {review.isApproved ? 'Approved' : 'Pending'}
                </div>
              </div>

              {/* Content */}
              <p className="text-zinc-400 text-sm leading-relaxed italic">
                "{review.description}"
              </p>

              {/* Actions */}
              <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                <button
                  onClick={() => handleDelete(review._id)}
                  disabled={processingId === review._id}
                  className="p-3 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-300 border border-rose-500/20"
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
                    className="px-6 py-2.5 rounded-xl bg-emerald-600/10 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all duration-300 border border-emerald-500/20 flex items-center gap-2 font-bold text-xs"
                  >
                    {processingId === review._id && isApproving ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <>
                        <Check size={16} />
                        Approve Review
                      </>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && filteredReviews.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center gap-4">
            <Loader2 size={40} className="text-brand animate-spin" />
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Loading Reviews...</p>
          </div>
        )}

        {!isLoading && filteredReviews.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center gap-4 bg-zinc-900/20 rounded-[2rem] border border-dashed border-zinc-800">
            <MessageSquare size={40} className="text-zinc-700" />
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">No reviews found</p>
          </div>
        )}
      </div>
    </div>
  );
}
