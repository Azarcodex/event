'use client';

import { motion } from 'framer-motion';
import { Contact } from 'lucide-react';
import Link from 'next/link';

export default function HelloCard() {
  return (
    <Link href="/connect" aria-label="Go to Connect page">
      <motion.button
        className="fixed bottom-6 right-6 z-[100] h-14 px-5 rounded-full bg-gradient-to-br from-[#1a1a1a] to-[#050505] border border-[#8ACD29]/40 shadow-[0_0_20px_rgba(138,205,41,0.2)] flex items-center justify-center gap-3 text-[#8ACD29] group overflow-hidden"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Glow effect inside button */}
        <div className="absolute inset-0 bg-[#8ACD29]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full blur-md" />
        
        {/* Pulse effect */}
        <motion.div
          className="absolute inset-0 border-2 border-[#8ACD29]/30 rounded-full"
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />

        <Contact className="w-5 h-5 text-[#8ACD29] relative z-10" />
        <span className="relative z-10 font-semibold text-sm tracking-wide text-[#8ACD29]">
          Hello Card
        </span>
      </motion.button>
    </Link>
  );
}
