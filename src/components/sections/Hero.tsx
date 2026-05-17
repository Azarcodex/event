'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ChevronRight, Play, ArrowRight, Loader2, Calendar } from 'lucide-react';
import { useHeroMedia } from '@/hooks/useHeroMedia';
import { IMedia } from '@/types/media';
import { cn } from '@/lib/utils';
import Magnetic from '@/components/ui/Magnetic';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function Hero() {
  const { media, loading } = useHeroMedia();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (media.length <= 1) return;
    
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % media.length);
    }, 8000); // 8 seconds per slide

    return () => clearInterval(timer);
  }, [media]);

  const slideVariants: Variants = {
    initial: (direction: number) => ({
      opacity: 0,
      scale: 1.1,
      x: direction > 0 ? 100 : -100,
    }),
    animate: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: {
        duration: 1.5,
        ease: "easeInOut",
      },
    },
    exit: (direction: number) => ({
      opacity: 0,
      scale: 0.9,
      x: direction > 0 ? -100 : 100,
      transition: {
        duration: 1.2,
        ease: "easeInOut",
      },
    }),
  };

  const scrollToServices = () => {
    const services = document.getElementById('services');
    if (services) {
      services.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <section className="relative h-[100vh] min-h-[700px] flex items-center justify-center bg-black overflow-hidden">
        <Loader2 className="w-12 h-12 text-brand animate-spin" />
      </section>
    );
  }

  // Fallback if no hero banners are selected
  if (media.length === 0) {
    return (
      <section className="relative h-[100vh] min-h-[700px] flex items-center overflow-hidden bg-black pt-32 md:pt-48">
        <div className="absolute inset-0 bg-zinc-900/50" />
        <div className="container mx-auto px-6 relative z-20">
          <div className="max-w-4xl">
             <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-bold leading-[0.8] tracking-tighter mb-8 text-white">
              Crafting <br />
              <span className="text-brand-gradient">Extraordinary</span> <br />
              Experiences
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 leading-relaxed max-w-2xl mb-12 font-medium">
              Premium weddings, corporate events, exhibitions, productions, and unforgettable celebrations across Kerala.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const safeIndex = currentIndex >= media.length ? 0 : currentIndex;
  const currentMedia = media[safeIndex];

  return (
    <section className="relative h-[100vh] min-h-[700px] flex items-center overflow-hidden bg-black pt-32 md:pt-48">
      {/* Background Media Carousel */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentMedia._id}
            custom={direction}
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0"
          >
            {currentMedia.mediaType === 'VIDEO' ? (
              <video
                key={`video-${currentMedia._id}`}
                src={currentMedia.secureUrl}
                className="h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <motion.img
                key={`img-${currentMedia._id}`}
                src={currentMedia.secureUrl}
                alt="Hero Event"
                className="h-full w-full object-cover"
                animate={{ scale: [1.1, 1] }}
                transition={{ duration: 8, ease: "linear" }}
              />
            )}
            
            {/* Cinematic Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60 opacity-80" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_black_100%)] opacity-40" />
            
            {/* 3D Floating Glow Effects */}
            <motion.div 
              animate={{ 
                x: [0, 50, 0],
                y: [0, 30, 0],
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand/10 blur-[120px] rounded-full pointer-events-none"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="container mx-auto px-6 relative z-20">
        <motion.div 
          className="max-w-5xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full border border-brand/20 glass-morphism-brand text-[10px] font-black uppercase tracking-[0.4em] text-brand-light mb-8 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
              Premium Event Production
            </span>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-bold leading-[0.8] tracking-tighter mb-8 text-white">
              Crafting <br />
              <motion.span 
                className="text-brand-gradient drop-shadow-[0_0_35px_rgba(16,185,129,0.4)]"
                animate={{ 
                  filter: ['drop-shadow(0 0 25px rgba(16,185,129,0.3))', 'drop-shadow(0 0 45px rgba(16,185,129,0.6))', 'drop-shadow(0 0 25px rgba(16,185,129,0.3))'],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                Extraordinary
              </motion.span> <br />
              Experiences
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-lg md:text-xl text-zinc-400 leading-relaxed max-w-2xl mb-12 font-medium"
          >
            Premium weddings, corporate events, exhibitions, productions, and unforgettable celebrations across Kerala.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="flex flex-col sm:flex-row items-center gap-6 mt-12"
          >
            <Magnetic>
              <Link
                href="/book-event"
                className="px-10 py-5 text-base font-bold tracking-tight bg-brand text-black hover:bg-brand-light shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_35px_rgba(16,185,129,0.5)] rounded-full flex items-center gap-2 transition-all"
              >
                <Calendar size={20} />
                Book Your Event
              </Link>
            </Magnetic>

            <Magnetic>
              <Button 
                variant="outline"
                size="lg" 
                className="px-10 py-5 text-base font-bold tracking-tight border-white/20 text-white hover:bg-white hover:text-black transition-all"
                onClick={scrollToServices}
              >
                Explore More
                <ArrowRight size={20} />
              </Button>
            </Magnetic>
          </motion.div>
        </motion.div>
      </div>

      {/* Progress Indicators */}
      <div className="absolute bottom-10 right-10 z-20 flex gap-2">
        {media.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > currentIndex ? 1 : -1);
              setCurrentIndex(i);
            }}
            className={cn(
              "h-1.5 rounded-full transition-all duration-500",
              currentIndex === i ? "w-12 bg-brand" : "w-4 bg-white/20 hover:bg-white/40"
            )}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-10 flex flex-col items-center gap-4 z-20"
      >
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 [writing-mode:vertical-lr]">Scroll</span>
        <motion.div 
          animate={{ y: [0, 15, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-[1px] h-12 bg-gradient-to-b from-brand to-transparent" 
        />
      </motion.div>
    </section>
  );
}
