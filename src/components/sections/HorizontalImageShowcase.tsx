'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useAnimationControls, PanInfo } from 'framer-motion';
import Image from 'next/image';
import { useMedia } from '@/hooks/useMedia';
import { IMedia } from '@/types/media';

export default function HorizontalImageShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { media, loading } = useMedia('', 'IMAGE');
  const [isDragging, setIsDragging] = useState(false);
  const controls = useAnimationControls();

  // Looped media for seamless marquee
  const loopedMedia = [...media, ...media, ...media];

  useEffect(() => {
    if (!loading && media.length > 0) {
      controls.start({
        x: [0, -100 * media.length],
        transition: {
          duration: media.length * 5,
          ease: "linear",
          repeat: Infinity,
        },
      });
    }
  }, [loading, media, controls]);

  const onDragStart = () => {
    setIsDragging(true);
    controls.stop();
  };

  const onDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false);
    // Resume animation after drag
    controls.start({
      x: [null, -100 * media.length],
      transition: {
        duration: media.length * 5,
        ease: "linear",
        repeat: Infinity,
      },
    });
  };

  return (
    <section className="py-16 md:py-32 bg-black overflow-hidden select-none border-t border-white/5">
      <div className="container mx-auto px-6 mb-12 md:mb-20 relative z-10">
        <h2 className="text-3xl md:text-5xl lg:text-7xl font-display font-bold text-white tracking-tighter leading-tight max-w-3xl">
          Visualizing <span className="text-brand-gradient">Unforgettable</span> <br className="hidden md:block" /> Celebrations
        </h2>
      </div>

      <div ref={containerRef} className="relative cursor-grab active:cursor-grabbing px-4 md:px-6">
        <motion.div 
          animate={controls}
          drag="x"
          dragConstraints={{ left: -100 * media.length * 2, right: 0 }}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          className="flex gap-6 md:gap-10 whitespace-nowrap"
        >
          {loopedMedia.map((item: IMedia, i: number) => (
            <motion.div
              key={`${item._id}-${i}`}
              className="relative flex-shrink-0 w-[300px] md:w-[450px] lg:w-[650px] aspect-[4/3] md:aspect-[16/10] rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-white/10 group bg-zinc-900 shadow-2xl"
              whileHover={{ scale: 1.02, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
            >
              <Image
                src={item.secureUrl}
                alt={item.title || "Event Production"}
                fill
                className="object-cover transition-transform duration-1000 scale-105 group-hover:scale-100"
              />
              
              
              <div className="absolute inset-0 p-6 md:p-12 flex flex-col justify-end transform translate-y-8 group-hover:translate-y-0 transition-all duration-700 opacity-0 group-hover:opacity-100">
                <h3 className="text-white text-xl md:text-3xl lg:text-4xl font-display font-bold">{item.title || "Signature Event"}</h3>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="mt-12 md:mt-24 container mx-auto px-6 flex justify-between items-center opacity-20 hover:opacity-100 transition-opacity duration-500">
        <div className="flex items-center gap-4">
          <div className="w-8 md:w-12 h-[1px] bg-white" />
          <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] text-white">Scroll or Drag to Explore</span>
        </div>
      </div>
    </section>
  );
}
