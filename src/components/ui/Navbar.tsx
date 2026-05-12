'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Camera, Play, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Services', href: '/#services' },
  { name: 'Contact', href: '/#contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-in-out',
        isScrolled 
          ? 'py-2 bg-zinc-950/90 backdrop-blur-sm border-b border-brand/5 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.7)]' 
          : 'py-6 bg-gradient-to-b from-black/80 via-black/20 to-transparent'
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center group relative h-24 md:h-32 w-80 md:w-[520px]">
          <Image
            src="/logo.png"
            alt="Green Hopper Events"
            fill
            className="object-contain transition-transform duration-500 group-hover:scale-105 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.1)] group-hover:drop-shadow-[0_0_12px_rgba(16,185,129,0.3)]"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                'text-sm font-medium tracking-wide transition-colors hover:text-brand-light',
                pathname === link.href ? 'text-brand-light' : 'text-zinc-400'
              )}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/#contact"
            className="px-6 py-2.5 bg-brand text-black text-sm font-bold rounded-full hover:bg-brand-light transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]"
          >
            Get in Touch
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 bg-zinc-950/98 backdrop-blur-md border-b border-white/5 px-6 py-10 md:hidden flex flex-col gap-6 shadow-2xl"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-2xl font-display font-bold hover:text-brand-light transition-colors text-white"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-6 border-t border-white/10 flex items-center gap-6">
              <a href="https://instagram.com/greenhoppereventsindia" target="_blank" className="text-zinc-400 hover:text-brand-light transition-colors">
                <Camera size={24} />
              </a>
              <a href="https://youtube.com/@GreenHopperEvents" target="_blank" className="text-zinc-400 hover:text-brand-light transition-colors">
                <Play size={24} />
              </a>
              <a href="tel:+910000000000" className="text-zinc-400 hover:text-brand-light transition-colors">
                <Phone size={24} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
