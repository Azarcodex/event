'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useAnimationControls, PanInfo } from 'framer-motion';
import { useReviews } from '@/hooks/useReviews';
import StarRating from '@/components/ui/StarRating';
import { Quote } from 'lucide-react';
import { IReview } from '@/types/review';

export default function ReviewsShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: reviews = [] as IReview[], isLoading } = useReviews();
  const [isDragging, setIsDragging] = useState(false);
  const controls = useAnimationControls();

  // Looped reviews for seamless marquee
  // We need at least enough reviews to cover the screen width twice
  const loopedReviews = reviews.length > 0 ? [...reviews, ...reviews, ...reviews, ...reviews] : [];

  useEffect(() => {
    if (!isLoading && reviews.length > 0) {
      controls.start({
        x: [0, -400 * reviews.length], // Assuming each card is ~400px wide
        transition: {
          duration: reviews.length * 8, // Adjust speed based on number of reviews
          ease: "linear",
          repeat: Infinity,
        },
      });
    }
  }, [isLoading, reviews.length, controls]);

  const onDragStart = () => {
    setIsDragging(true);
    controls.stop();
  };

  const onDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false);
    // Resume animation after drag
    controls.start({
      x: [null, -400 * reviews.length],
      transition: {
        duration: reviews.length * 8,
        ease: "linear",
        repeat: Infinity,
      },
    });
  };

  if (isLoading) {
    return (
      <section className="py-24 bg-black overflow-hidden">
        <div className="container mx-auto px-6 mb-16">
          <div className="h-12 w-64 bg-zinc-900 animate-pulse rounded-lg" />
        </div>
        <div className="flex gap-8 px-6 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-shrink-0 w-[400px] h-[250px] bg-zinc-900 animate-pulse rounded-[2rem]" />
          ))}
        </div>
      </section>
    );
  }

  if (reviews.length === 0) return null;

  return (
    <section className="py-24 md:py-32 bg-black overflow-hidden select-none border-t border-white/5 relative">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-brand/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 mb-16 md:mb-24 relative z-10 text-center md:text-left">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-brand font-black uppercase tracking-[0.4em] text-[10px] md:text-xs mb-4 block"
        >
          Testimonials
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white tracking-tighter leading-tight"
        >
          Unforgettable <span className="text-brand-gradient">Experiences</span> <br className="hidden md:block" /> Defined by Our Clients
        </motion.h2>
      </div>

      <div ref={containerRef} className="relative cursor-grab active:cursor-grabbing">
        <motion.div 
          animate={controls}
          drag="x"
          dragConstraints={{ left: -400 * reviews.length * 2, right: 0 }}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          className="flex gap-6 md:gap-8 whitespace-nowrap px-6"
        >
          {loopedReviews.map((review: IReview, i: number) => (
            <motion.div
              key={`${review._id}-${i}`}
              className="relative flex-shrink-0 w-[300px] md:w-[450px] p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] glass-morphism group overflow-hidden"
              whileHover={{ 
                scale: 1.02, 
                backgroundColor: "rgba(255, 255, 255, 0.04)",
                transition: { duration: 0.4 } 
              }}
            >
              {/* Card Accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="flex flex-col gap-6 h-full relative z-10">
                <div className="flex justify-between items-start">
                  <StarRating rating={review.rating} size={18} />
                  <Quote className="text-brand/20 group-hover:text-brand/40 transition-colors duration-500" size={40} />
                </div>

                <p className="text-white/80 text-lg md:text-xl font-medium leading-relaxed whitespace-normal italic">
                  "{review.description}"
                </p>

                <div className="mt-auto pt-6 border-t border-white/5">
                  <h4 className="text-white font-display font-bold text-lg md:text-xl tracking-tight">
                    {review.name}
                  </h4>
                  <p className="text-brand/60 text-sm font-black uppercase tracking-[0.2em] mt-1">
                    Verified Client
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="mt-16 container mx-auto px-6 flex justify-center items-center opacity-30">
        <div className="flex items-center gap-4">
          <div className="w-12 h-[1px] bg-white" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Drag to Explore More Stories</span>
          <div className="w-12 h-[1px] bg-white" />
        </div>
      </div>
    </section>
  );
}
