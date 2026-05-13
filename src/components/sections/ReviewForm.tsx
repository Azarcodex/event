'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { reviewSchema, ReviewInput } from '@/lib/validators/review.validator';
import { useCreateReview } from '@/hooks/useReviews';
import StarRating from '@/components/ui/StarRating';
import { Send, CheckCircle2, Loader2 } from 'lucide-react';

export default function ReviewForm() {
  const [hoverRating, setHoverRating] = useState(0);
  const { mutate: submitReview, isPending, isSuccess } = useCreateReview();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ReviewInput>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 5,
    },
  });

  const rating = watch('rating');

  const onSubmit = (data: ReviewInput) => {
    submitReview(data, {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <section className="py-24 md:py-32 bg-black relative overflow-hidden border-t border-white/5">
      {/* Decorative elements */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand/5 blur-[120px] rounded-full pointer-events-none translate-x-1/4 translate-y-1/4" />

      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-brand font-black uppercase tracking-[0.4em] text-[10px] md:text-xs mb-4 block"
            >
              Share Your Story
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-display font-bold text-white tracking-tighter leading-tight"
            >
              How was your <span className="text-brand-gradient">Experience</span>?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/60 text-lg mt-6 leading-relaxed"
            >
              Your feedback helps us continue creating unforgettable moments. We'd love to hear your thoughts on our services and team.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-12 p-8 rounded-[2rem] glass-morphism-brand border-brand/20 inline-block"
            >
              <p className="text-brand/80 text-sm font-bold uppercase tracking-widest mb-3">Rate Us</p>
              <StarRating 
                rating={rating} 
                interactive 
                size={32}
                onRatingChange={(val) => setValue('rating', val)}
                hoverRating={hoverRating}
                onHoverChange={setHoverRating}
              />
              {errors.rating && (
                <p className="text-red-500 text-xs mt-2">{errors.rating.message}</p>
              )}
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="glass-morphism p-8 md:p-12 rounded-[2.5rem] border-white/10"
          >
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center text-center py-12"
                >
                  <div className="w-20 h-20 bg-brand/10 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="text-brand" size={40} />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">Thank You!</h3>
                  <p className="text-white/60">Your review has been submitted and is currently being reviewed by our team.</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.location.reload()}
                    className="mt-8 px-8 py-3 bg-brand/10 text-brand font-bold rounded-full border border-brand/20 hover:bg-brand/20 transition-all"
                  >
                    Submit Another
                  </motion.button>
                </motion.div>
              ) : (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit(onSubmit)} 
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-white/40 text-[10px] font-black uppercase tracking-widest mb-3 px-2">
                      Full Name
                    </label>
                    <input
                      {...register('name')}
                      type="text"
                      placeholder="e.g. John & Sarah Doe"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-brand/50 focus:bg-white/[0.08] transition-all"
                    />
                    {errors.name && (
                      <p className="text-red-500/80 text-xs mt-2 px-2">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white/40 text-[10px] font-black uppercase tracking-widest mb-3 px-2">
                      Your Review
                    </label>
                    <textarea
                      {...register('description')}
                      rows={5}
                      placeholder="Tell us about your experience..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-brand/50 focus:bg-white/[0.08] transition-all resize-none"
                    />
                    {errors.description && (
                      <p className="text-red-500/80 text-xs mt-2 px-2">{errors.description.message}</p>
                    )}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isPending}
                    className="w-full bg-brand hover:bg-brand-light text-black font-display font-black uppercase tracking-widest py-5 rounded-2xl flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed group shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
                  >
                    {isPending ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        Submit Story
                        <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
