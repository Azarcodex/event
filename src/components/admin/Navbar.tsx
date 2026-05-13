'use client';

import { Search, Bell, User, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavbarProps {
  admin?: any;
  onMenuClick: () => void;
}

export function Navbar({ admin, onMenuClick }: NavbarProps) {
  return (
    <header className="h-16 border-b border-zinc-800 bg-[#09090b]/80 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between sticky top-0 z-40 transition-all">
      <div className="flex items-center gap-4 flex-1">
        {/* Mobile menu trigger */}
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-all"
        >
          <Menu size={20} />
        </button>

        {/* Search - Responsive behavior */}
        {/* <div className="relative max-w-md w-full group hidden sm:block">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-2 pl-10 pr-4 outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all text-sm text-zinc-300"
          />
        </div> */}
        
        {/* Mobile Search Trigger (Placeholder for now) */}
        {/* <button className="sm:hidden p-2 text-zinc-400 hover:text-white">
          <Search size={20} />
        </button> */}
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notifications */}
        {/* <button className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-all relative">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-[#09090b]" />
        </button> */}
        
        <div className="h-6 w-px bg-zinc-800 mx-1 hidden sm:block" />

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-2 group cursor-pointer">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-white leading-tight">{admin?.name || 'Admin'}</p>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{admin?.role || 'Administrator'}</p>
          </div>
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white transition-all group-hover:border-indigo-500 group-hover:shadow-lg group-hover:shadow-indigo-500/10 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-20" />
            <User size={20} className="relative z-10" />
          </div>
        </div>
      </div>
    </header>
  );
}
