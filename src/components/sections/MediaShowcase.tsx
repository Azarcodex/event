'use client';

import { motion } from 'framer-motion';
import { useMedia } from '@/hooks/useMedia';
import Image from 'next/image';
import { Play, Maximize2 } from 'lucide-react';
import { useState } from 'react';
import MediaModal from '@/components/ui/MediaModal';
import { cn } from '@/lib/utils';
import { IMedia } from '@/types/media';

export default function MediaShowcase() {
  const { media, loading } = useMedia('', 'ALL');
  const [selectedMedia, setSelectedMedia] = useState<IMedia | null>(null);

  if (loading) {
    return (
      <section className="py-24 bg-black">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-zinc-900/50 animate-pulse rounded-2xl border border-white/5" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-32 bg-black overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-dark/5 via-black to-black opacity-50 pointer-events-none" />
      
      <div className="container mx-auto px-6 mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
        <div className="max-w-2xl">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-light mb-4 block">Our Portfolio</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight leading-tight">
            Cinematic <br /><span className="text-brand-gradient">Execution</span>
          </h2>
        </div>
        <p className="text-zinc-400 text-sm max-w-sm leading-relaxed">
          Explore a curated selection of our most spectacular luxury weddings, brand launches, and corporate events. Every frame tells a story.
        </p>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {media.map((item: IMedia, index: number) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className={cn(
                "group relative rounded-2xl overflow-hidden bg-zinc-950 cursor-pointer border border-white/5 hover:border-brand/30 transition-all duration-500 shadow-2xl",
                index % 3 === 0 ? "md:row-span-2" : ""
              )}
              onClick={() => setSelectedMedia(item)}
            >
              <div className="aspect-square md:aspect-auto h-full min-h-[300px]">
                {item.mediaType === 'VIDEO' ? (
                  <div className="relative h-full w-full">
                    <video
                      src={item.secureUrl}
                      className="h-full w-full object-cover transition-all duration-1000 scale-105 group-hover:scale-100"
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-full glass-morphism flex items-center justify-center border border-white/10 group-hover:border-brand/40 group-hover:bg-brand/10 transition-all duration-500">
                      <Play size={14} className="text-white fill-white group-hover:text-brand-light group-hover:fill-brand-light transition-colors" />
                    </div>
                  </div>
                ) : (
                  <Image
                    src={item.secureUrl}
                    alt="Event Media"
                    fill
                    className="object-cover transition-all duration-1000 scale-105 group-hover:scale-100"
                  />
                )}
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex flex-col justify-end p-6">
                <div className="flex items-center justify-between transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                  <div>
                    <h4 className="text-white font-bold text-lg font-display tracking-wide">Event Highlight</h4>
                    <p className="text-brand-light text-[10px] uppercase tracking-widest mt-1 font-bold">Showcase</p>
                  </div>
                  <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-brand/50 group-hover:bg-brand/10 transition-all duration-500">
                    <Maximize2 size={16} className="text-white group-hover:text-brand-light transition-colors" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
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

