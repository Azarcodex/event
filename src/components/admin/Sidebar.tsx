'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import axios from 'axios';
import { 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  Layers,
  Image as ImageIcon,
  X,
  MessageSquare,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Media Management', href: '/admin/media-management', icon: Layers },
  { label: 'Banner Management', href: '/admin/banner-management', icon: ImageIcon },
  { label: 'Reviews Management', href: '/admin/reviews', icon: MessageSquare },
  { label: 'Event Bookings', href: '/admin/bookings', icon: Calendar },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.post('/api/admin/logout');
      router.replace('/admin/login');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-50 w-72 bg-[#09090b] border-r border-zinc-800 flex flex-col h-screen transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      {/* Brand / Logo */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-800/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <Layers size={18} className="text-white" />
          </div>
          <span className="font-bold text-white tracking-tight text-lg">Admin Panel</span>
        </div>
        
        {/* Mobile close button */}
        <button 
          onClick={onClose}
          className="lg:hidden p-2 text-zinc-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <div className="px-3 mb-2">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Menu</p>
        </div>
        
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative",
                isActive 
                  ? "bg-indigo-600/10 text-indigo-400 font-semibold" 
                  : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50"
              )}
            >
              <item.icon 
                size={20} 
                className={cn(
                  "transition-colors",
                  isActive ? "text-indigo-400" : "text-zinc-500 group-hover:text-zinc-300"
                )} 
              />
              <span className="text-sm">{item.label}</span>
              
              {isActive && (
                <div className="absolute right-3 w-1.5 h-1.5 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-zinc-800/50">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-3 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/5 rounded-xl transition-all duration-200 group"
        >
          <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
