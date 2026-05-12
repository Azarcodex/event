'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Camera, Play, Phone, Mail, MapPin } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';

export default function Footer() {
  const { data: settings } = useSettings();

  return (
    <footer className="bg-zinc-950 border-t border-white/5 pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="space-y-6">
            <Link href="/" className="flex items-center relative h-28 md:h-36 w-96 md:w-[480px] group">
              <Image
                src="/logo.png"
                alt="Green Hopper Events"
                fill
                className="object-contain transition-transform duration-500 group-hover:scale-105 filter drop-shadow-[0_0_10px_rgba(255,255,255,0.05)] group-hover:drop-shadow-[0_0_15px_rgba(16,185,129,0.2)]"
              />
            </Link>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
              Crafting extraordinary event experiences with a passion for creativity and precision. Kerala's premier corporate event management agency.
            </p>
            <div className="flex items-center gap-4">
              <a href={settings?.socials.instagram} target="_blank" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-400 hover:text-brand-light hover:border-brand-light hover:bg-brand/10 transition-all">
                <Camera size={18} />
              </a>
              <a href={settings?.socials.youtube} target="_blank" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-400 hover:text-brand-light hover:border-brand-light hover:bg-brand/10 transition-all">
                <Play size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link href="/" className="text-zinc-400 hover:text-brand-light text-sm transition-colors">Home</Link></li>
              <li><Link href="/gallery" className="text-zinc-400 hover:text-brand-light text-sm transition-colors">Media Showcase</Link></li>
              <li><Link href="/#services" className="text-zinc-400 hover:text-brand-light text-sm transition-colors">Services</Link></li>
              <li><Link href="/#contact" className="text-zinc-400 hover:text-brand-light text-sm transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Services</h4>
            <ul className="space-y-4">
              <li className="text-zinc-400 text-sm">Corporate Events</li>
              <li className="text-zinc-400 text-sm">Exhibitions</li>
              <li className="text-zinc-400 text-sm">Brand Launches</li>
              <li className="text-zinc-400 text-sm">Weddings</li>
              <li className="text-zinc-400 text-sm">Creative Production</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-zinc-400 text-sm">
                <MapPin size={18} className="text-brand-light shrink-0" />
                <span>{settings?.address || 'Kerala, India'}</span>
              </li>
              <li className="flex items-center gap-3 text-zinc-400 text-sm">
                <Phone size={18} className="text-brand-light shrink-0" />
                <span>{settings?.phoneNumber}</span>
              </li>
              <li className="flex items-center gap-3 text-zinc-400 text-sm">
                <Mail size={18} className="text-brand-light shrink-0" />
                <span>{settings?.email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-zinc-600 text-xs font-medium uppercase tracking-widest">
          <p>© {new Date().getFullYear()} Green Hopper Events. All Rights Reserved.</p>
          <div className="flex gap-8">
            <span className="hover:text-brand-light transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-brand-light transition-colors cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
