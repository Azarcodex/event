import Image from 'next/image';
import Link from 'next/link';
import { Phone, MapPin, Briefcase, Calendar } from 'lucide-react';
import CopyLinkButton from './CopyLinkButton';

const InstagramIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const FacebookIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const WhatsappIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

export const metadata = {
  title: 'Connect | GreenHopper Events',
  description: 'Connect with GreenHopper Events via our primary contact links.',
};

export default function ConnectPage() {
  const links = [
    { name: 'Call', icon: Phone, href: 'tel:+919048788884' },
    { name: 'Whatsapp', icon: WhatsappIcon, href: 'https://wa.me/919048788884' },
    { name: 'Instagram', icon: InstagramIcon, href: 'https://www.instagram.com/greenhoppereventsindia?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==' },
    { name: 'Facebook', icon: FacebookIcon, href: 'https://www.facebook.com/GreenHopperEvents/' },
    { name: 'Services', icon: Briefcase, href: '/#services' },
    { name: 'Book Event', icon: Calendar, href: '/book-event' },
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 sm:p-12 font-sans selection:bg-[#DBB557]/30 relative">
      <CopyLinkButton />
      
      <div className="w-full max-w-sm flex flex-col items-center">
        
        {/* Logo Section */}
        <div className="mb-12 flex flex-col items-center">
          <div className="relative w-48 h-48 sm:w-64 sm:h-64 filter drop-shadow-[0_0_15px_rgba(219,181,87,0.3)]">
            <Image 
              src="/logo.png" 
              alt="GreenHopper Events Logo" 
              fill 
              className="object-contain" 
            />
          </div>
        </div>

        {/* 3x2 Grid Section */}
        <div className="grid grid-cols-3 gap-x-6 gap-y-8 w-full max-w-[320px] mb-12">
          {links.map((link, idx) => (
            <Link 
              key={idx} 
              href={link.href}
              className="group flex flex-col items-center gap-3 transition-transform hover:scale-105 active:scale-95"
            >
              {/* Icon Square */}
              <div className="w-[72px] h-[72px] flex items-center justify-center rounded-[18px] border-[2.5px] border-[#DBB557] bg-transparent shadow-[0_4px_10px_rgba(0,0,0,0.2)] group-hover:bg-[#DBB557]/10 group-hover:shadow-[0_0_15px_rgba(219,181,87,0.4)] transition-all">
                <link.icon className="text-[#DBB557]" size={28} />
              </div>
              {/* Text Label */}
              <span className="text-[#DBB557] text-sm font-medium tracking-wide drop-shadow-md">
                {link.name}
              </span>
            </Link>
          ))}
        </div>

        {/* Bottom Wide Button */}
        <Link 
          href="https://maps.app.goo.gl/jKbpYNHWk3RQc4GX6" 
          target="_blank"
          className="group relative w-full max-w-[280px] h-14 rounded-2xl border-[2.5px] border-[#DBB557] flex items-center justify-center gap-3 bg-gradient-to-b from-[#DBB557]/40 to-[#DBB557]/10 hover:from-[#DBB557]/50 hover:to-[#DBB557]/20 shadow-[0_4px_10px_rgba(0,0,0,0.2)] transition-all hover:scale-105 active:scale-95 overflow-hidden"
        >
          {/* Subtle inner highlight */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10 opacity-50" />
          
          <MapPin className="text-[#DBB557] z-10 drop-shadow-sm" size={20} />
          <span className="text-[#DBB557] font-bold text-sm tracking-widest z-10 drop-shadow-sm">
            Location
          </span>
        </Link>
        
      </div>
      
    </div>
  );
}
