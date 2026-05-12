'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useAnimationControls, PanInfo } from 'framer-motion';
import { useMedia } from '@/hooks/useMedia';
import { Play, Maximize2 } from 'lucide-react';
import MediaModal from '@/components/ui/MediaModal';
import { IMedia } from '@/types/media';

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { media, loading } = useMedia('', 'VIDEO');
  const [selectedMedia, setSelectedMedia] = useState<IMedia | null>(null);
  const controls = useAnimationControls();

  // Looped media for seamless marquee
  const loopedMedia = [...media, ...media, ...media];

  useEffect(() => {
    if (!loading && media.length > 0) {
      controls.start({
        x: [0, -120 * media.length],
        transition: {
          duration: media.length * 6,
          ease: "linear",
          repeat: Infinity,
        },
      });
    }
  }, [loading, media, controls]);

  const onDragStart = () => {
    controls.stop();
  };

  const onDragEnd = (event: any, info: PanInfo) => {
    controls.start({
      x: [null, -120 * media.length],
      transition: {
        duration: media.length * 6,
        ease: "linear",
        repeat: Infinity,
      },
    });
  };

  return (
    <section id="about" className="py-20 md:py-40 bg-zinc-950 overflow-hidden relative border-t border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-dark/10 via-transparent to-transparent opacity-50" />
      
      <div className="container mx-auto px-6 mb-12 md:mb-24 flex flex-col md:flex-row items-end justify-between gap-8 md:gap-12 relative z-10">
        <div className="max-w-3xl">
          <h2 className="text-3xl md:text-5xl lg:text-7xl font-display font-bold text-white tracking-tighter leading-tight">
            The <span className="text-brand-gradient">Art</span> of Motion <br /> Storytelling
          </h2>
        </div>
        <p className="text-zinc-500 text-sm md:text-base max-w-sm leading-relaxed border-l border-brand/20 pl-6 md:pl-8">
          A high-impact cinematic collection of our most energetic event productions, from grand stages to luxury celebrations.
        </p>
      </div>

      <div ref={containerRef} className="relative cursor-grab active:cursor-grabbing px-6 md:px-12">
        <motion.div 
          animate={controls}
          drag="x"
          dragConstraints={{ left: -120 * media.length * 2, right: 0 }}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          className="flex gap-8 md:gap-12"
        >
          {loopedMedia.map((item: IMedia, i: number) => (
            <motion.div
              key={`${item._id}-${i}`}
              className="relative flex-shrink-0 w-[320px] md:w-[550px] lg:w-[850px] aspect-video rounded-[2rem] md:rounded-[4rem] overflow-hidden border border-white/5 group bg-black shadow-2xl cursor-pointer"
              onClick={() => setSelectedMedia(item)}
              whileHover={{ scale: 1.015, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
            >
              <video
                src={item.secureUrl}
                className="h-full w-full object-cover transition-all duration-1000 scale-105 group-hover:scale-100"
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
              
              
              {/* Play Indicator */}
              <div className="absolute top-6 md:top-12 right-6 md:right-12 w-12 md:w-20 h-12 md:h-20 rounded-full glass-morphism-brand flex items-center justify-center border border-brand/20 group-hover:scale-110 transition-transform duration-500 opacity-100 md:opacity-0 group-hover:opacity-100">
                <Play size={20} className="text-brand-light fill-brand-light md:hidden" />
                <Play size={28} className="text-brand-light fill-brand-light hidden md:block" />
              </div>

              <div className="absolute inset-0 p-8 md:p-16 flex flex-col justify-end transform translate-y-8 group-hover:translate-y-0 transition-all duration-700 opacity-0 group-hover:opacity-100">
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="text-white text-xl md:text-4xl lg:text-5xl font-display font-bold">{item.title}</h3>
                  </div>
                  <div className="w-10 md:w-16 h-10 md:h-16 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-brand/10 group-hover:border-brand/50 transition-all">
                    <Maximize2 size={18} className="text-white md:hidden" />
                    <Maximize2 size={28} className="text-white hidden md:block" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="mt-12 md:mt-24 container mx-auto px-6 flex justify-between items-center opacity-20 hover:opacity-100 transition-opacity duration-500">
        <div className="flex items-center gap-4">
          <div className="w-8 md:w-12 h-[1px] bg-white" />
          <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] text-white">Experience the Energy</span>
        </div>
      </div>

      <MediaModal 
        isOpen={!!selectedMedia} 
        onClose={() => setSelectedMedia(null)} 
        media={selectedMedia} 
      />
    </section>
  );
}
