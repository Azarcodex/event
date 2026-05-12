'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { IMedia } from '@/types/media';

interface MediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  media: IMedia | null;
}

export default function MediaModal({ isOpen, onClose, media }: MediaModalProps) {
  if (!media) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 md:p-10"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-[110] text-white/50 hover:text-white transition-colors"
          >
            <X size={32} />
          </button>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-6xl aspect-video rounded-2xl overflow-hidden shadow-2xl"
          >
            {media.mediaType === 'VIDEO' ? (
              <video
                src={media.secureUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            ) : (
              <Image
                src={media.secureUrl}
                alt="Fullscreen"
                fill
                className="object-contain"
              />
            )}
          </motion.div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center">
            <h3 className="text-white font-display font-bold text-2xl mb-1">Extraordinary Event</h3>
            <p className="text-zinc-500 text-sm uppercase tracking-[0.2em]">Creative Production • Kerala</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
