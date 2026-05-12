'use client';

import { useState } from 'react';
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { useMedia } from '@/hooks/useMedia';
import Image from 'next/image';
import { Play, Maximize2, Filter } from 'lucide-react';
import MediaModal from '@/components/ui/MediaModal';
import { IMedia } from '@/types/media';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function GalleryPage() {
  const { media, loading, typeFilter, setTypeFilter } = useMedia('', 'ALL');
  const [selectedMedia, setSelectedMedia] = useState<IMedia | null>(null);

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500 mb-4 block">Archive</span>
              <h1 className="text-5xl md:text-7xl font-display font-bold text-white tracking-tighter">Media Showcase</h1>
            </div>
            
            {/* Filter Tabs */}
            <div className="flex items-center gap-2 p-1 bg-white/5 rounded-full border border-white/5">
              {['ALL', 'IMAGE', 'VIDEO'].map((type) => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type as any)}
                  className={cn(
                    "px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all",
                    typeFilter === type ? "bg-white text-black" : "text-zinc-500 hover:text-white"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="aspect-square bg-zinc-900 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {media.map((item: IMedia, index: number) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative aspect-square rounded-2xl overflow-hidden bg-zinc-900 cursor-pointer"
                  onClick={() => setSelectedMedia(item)}
                >
                  {item.mediaType === 'VIDEO' ? (
                    <>
                      <video
                        src={item.secureUrl}
                        className="h-full w-full object-cover transition-all duration-700"
                        muted
                        loop
                        playsInline
                      />
                      <div className="absolute top-4 right-4 w-8 h-8 rounded-full glass-morphism flex items-center justify-center">
                        <Play size={14} className="text-white fill-white" />
                      </div>
                    </>
                  ) : (
                    <Image
                      src={item.secureUrl}
                      alt="Gallery Media"
                      fill
                      className="object-cover group-hover:scale-110 transition-all duration-700"
                    />
                  )}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Maximize2 size={24} className="text-white" />
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {!loading && media.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-zinc-500 font-medium">No media found in this category.</p>
            </div>
          )}
        </div>
      </main>

      <MediaModal 
        isOpen={!!selectedMedia} 
        onClose={() => setSelectedMedia(null)} 
        media={selectedMedia} 
      />
      <Footer />
    </div>
  );
}
