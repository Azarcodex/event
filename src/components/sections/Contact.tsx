'use client';

import { motion } from 'framer-motion';
import { Phone, Mail, MessageSquare, Camera, Play, MapPin } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import Button from '@/components/ui/Button';

export default function Contact() {
  const { data: settings } = useSettings();

  const contactMethods = [
    {
      icon: <Phone size={24} />,
      label: 'Call Us',
      value: settings?.phoneNumber,
      href: `tel:${settings?.phoneNumber}`,
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      description: 'Available Mon-Sat, 9am-6pm'
    },
    {
      icon: <MessageSquare size={24} />,
      label: 'WhatsApp',
      value: 'Live Chat',
      href: `https://wa.me/${settings?.phoneNumber?.replace(/\D/g, '')}`,
      color: 'bg-green-500/10 text-green-400 border-green-500/20',
      description: 'Get instant event quotes'
    },
    {
      icon: <Mail size={24} />,
      label: 'Email',
      value: settings?.email,
      href: `mailto:${settings?.email}`,
      color: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
      description: 'Drop us a detailed inquiry'
    },
  ];

  return (
    <section id="contact" className="py-24 md:py-32 bg-black relative border-t border-white/5 overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-brand/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16 md:mb-24">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-light mb-4 block"
          >
            Connect With Us
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white tracking-tight mb-8 leading-[1.1]"
          >
            Ready to Plan Your <br /><span className="text-brand-gradient">Masterpiece?</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 text-base md:text-lg max-w-2xl mx-auto font-medium"
          >
            From intimate weddings to grand corporate launches, our team is ready to bring your vision to life.
          </motion.p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16 md:mb-24">
          {contactMethods.map((method, i) => (
            <motion.a
              key={method.label}
              href={method.href}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              viewport={{ once: true }}
              className="group relative p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] bg-zinc-900/40 border border-white/5 hover:border-brand/40 transition-all duration-500 flex flex-col items-center text-center shadow-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl ${method.color} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative z-10`}>
                {method.icon}
              </div>
              
              <div className="relative z-10">
                <span className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-3 block">{method.label}</span>
                <h4 className="text-white font-display font-bold text-lg md:text-xl group-hover:text-brand-light transition-colors mb-3 break-all px-2 leading-tight">
                  {method.value}
                </h4>
                <p className="text-zinc-500 text-xs font-medium leading-relaxed max-w-[200px] mx-auto">
                  {method.description}
                </p>
              </div>
            </motion.a>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch">
          {/* Map Container */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-7 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border border-white/5 h-[350px] md:h-[600px] relative group shadow-2xl order-2 lg:order-1"
          >
            <div className="absolute inset-0 bg-brand/5 mix-blend-overlay pointer-events-none group-hover:opacity-0 transition-opacity duration-1000 z-10" />
            <div className="absolute top-4 md:top-6 left-4 md:left-6 z-20 px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[8px] md:text-[10px] font-black uppercase tracking-widest text-white shadow-xl">
              Based in Kerala, India
            </div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.6924064553086!2d76.1839735748081!3d10.986573889175226!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba7cc543a3f194d%3A0xcffaf199125767a1!2sGreen%20Hopper%20Events!5e0!3m2!1sen!2sin!4v1778568852754!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'grayscale(1) invert(0.9) contrast(1.2)' }}
              allowFullScreen
              loading="lazy"
            />
          </motion.div>

          {/* Side Content */}
          <div className="lg:col-span-5 flex flex-col gap-6 md:gap-8 order-1 lg:order-2">
            {/* Instagram Section */}
            <motion.a
              href={settings?.socials.instagram}
              target="_blank"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="group relative flex-1 min-h-[140px] md:min-h-[160px] rounded-[2rem] md:rounded-[2.5rem] bg-zinc-900/40 border border-white/5 hover:border-pink-500/30 p-8 md:p-10 flex flex-col justify-between overflow-hidden transition-all duration-500 shadow-xl"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 blur-[60px] rounded-full pointer-events-none group-hover:bg-pink-500/20 transition-all duration-700" />
              
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform duration-500">
                  <Camera size={20} />
                </div>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[8px] font-black uppercase tracking-[0.2em] text-zinc-500 group-hover:text-pink-400 transition-colors">
                  Instagram
                </span>
              </div>
              
              <div>
                <h3 className="text-white font-display font-bold text-2xl md:text-3xl mb-1 md:mb-2">Visual Stories</h3>
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] group-hover:text-zinc-300 transition-colors">
                  @greenhopperevents
                </p>
              </div>
            </motion.a>

            {/* YouTube Section */}
            <motion.a
              href={settings?.socials.youtube}
              target="_blank"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="group relative flex-1 min-h-[140px] md:min-h-[160px] rounded-[2rem] md:rounded-[2.5rem] bg-zinc-900/40 border border-white/5 hover:border-red-500/30 p-8 md:p-10 flex flex-col justify-between overflow-hidden transition-all duration-500 shadow-xl"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-[60px] rounded-full pointer-events-none group-hover:bg-red-500/20 transition-all duration-700" />
              
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform duration-500">
                  <Play size={20} fill="currentColor" />
                </div>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[8px] font-black uppercase tracking-[0.2em] text-zinc-500 group-hover:text-red-500 transition-colors">
                  YouTube
                </span>
              </div>
              
              <div>
                <h3 className="text-white font-display font-bold text-2xl md:text-3xl mb-1 md:mb-2">Cinematic Reels</h3>
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] group-hover:text-zinc-300 transition-colors">
                  @GreenHopperEvents
                </p>
              </div>
            </motion.a>

            {/* Office Address Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="group rounded-[2rem] md:rounded-[2.5rem] bg-brand-dark/10 border border-brand/20 p-8 md:p-10 flex gap-6 items-center shadow-xl hover:bg-brand-dark/20 transition-all duration-500"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-brand/20 flex items-center justify-center text-brand-light shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.2)] group-hover:scale-110 transition-transform duration-500">
                <MapPin size={24} />
              </div>
              <div>
                <h4 className="text-white font-black text-[10px] uppercase tracking-[0.3em] mb-2 text-brand-light/70">Main Headquarters</h4>
                <p className="text-zinc-300 text-sm md:text-base leading-relaxed font-medium">
                  {settings?.address || 'Green Hopper Events, Kerala, India'}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
