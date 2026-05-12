'use client';

import { motion, Variants } from 'framer-motion';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

const services = [
  // ... (keeping same content)
  {
    title: "Wedding Planning & Management",
    description: "Stress-free luxury wedding experiences crafted with elegance, precision, and unforgettable moments.",
    image: "/images/services/wedding.png",
    gridClass: "md:col-span-2 md:row-span-2",
  },
  {
    title: "Exhibitions & Trade Fairs",
    description: "Professional exhibition and trade fair management delivering impactful brand experiences.",
    image: "/images/services/exhibition.png",
    gridClass: "md:col-span-1 md:row-span-1",
  },
  {
    title: "Corporate Events & Shows",
    description: "High-quality corporate productions, conferences, and stage experiences tailored for modern brands.",
    image: "/images/services/corporate.png",
    gridClass: "md:col-span-1 md:row-span-1",
  },
  {
    title: "Inaugurations & House Warmings",
    description: "Smoothly executed inaugurations and housewarming events designed for memorable first impressions.",
    image: "/images/services/inauguration.png",
    gridClass: "md:col-span-1 md:row-span-1",
  },
  {
    title: "Social Events & Media Activities",
    description: "Creative social events and media-driven experiences that bring people and brands together.",
    image: "/images/services/social.png",
    gridClass: "md:col-span-2 md:row-span-1",
  }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      duration: 0.8, 
      ease: [0.16, 1, 0.3, 1] 
    } 
  },
};

export default function Services() {
  return (
    <section className="py-24 md:py-40 bg-black overflow-hidden" id="services">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="max-w-4xl mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full border border-brand/20 glass-morphism-brand text-[10px] font-black uppercase tracking-[0.4em] text-brand-light mb-8 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
              Excellence in Production
            </span>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white tracking-tighter leading-tight mb-8">
              Our <span className="text-brand-gradient">Services</span>
            </h2>
            <p className="text-zinc-400 text-lg md:text-xl max-w-2xl leading-relaxed font-medium">
              From luxury weddings to corporate productions, Green Hopper Events crafts unforgettable experiences with precision, creativity, and flawless execution.
            </p>
          </motion.div>
        </div>

        {/* Services Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className={`group relative overflow-hidden rounded-[2rem] md:rounded-[3rem] border border-white/5 bg-zinc-900 aspect-[4/3] md:aspect-auto ${service.gridClass} h-full min-h-[300px] md:min-h-[400px]`}
            >
              {/* Background Image */}
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-cover transition-transform duration-1000 scale-105 group-hover:scale-100 opacity-60 group-hover:opacity-100"
              />

              {/* Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-700" />
              
              {/* Animated Border Glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_var(--tw-gradient-stops))] from-brand/20 via-transparent to-transparent" />
              </div>

              {/* Content */}
              <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl md:text-3xl font-display font-bold text-white leading-tight max-w-[80%]">
                      {service.title}
                    </h3>
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/20 flex items-center justify-center text-white group-hover:bg-brand group-hover:border-brand group-hover:text-black transition-all duration-500 transform group-hover:rotate-45">
                      <ArrowUpRight size={20} />
                    </div>
                  </div>
                  <p className="text-zinc-400 text-sm md:text-base leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                    {service.description}
                  </p>
                </div>
              </div>

              {/* Bottom Glow Line */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
