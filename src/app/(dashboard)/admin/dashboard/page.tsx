import dbConnect from '@/lib/mongodb';
import Media from '@/models/Media';
import AdminUser from '@/models/Admin';
import { 
  Users, 
  Image as ImageIcon,
  Clock,
  LayoutDashboard,
  ShieldCheck,
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
  await dbConnect();

  // Fetch real counts from DB
  const [mediaCount, adminCount] = await Promise.all([
    Media.countDocuments(),
    AdminUser.countDocuments(),
  ]);

  const stats = [
    { label: 'Total Admins', value: adminCount.toString(), icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { label: 'Media Files', value: mediaCount.toString(), icon: ImageIcon, color: 'text-indigo-500', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Dashboard Overview</h2>
          <p className="text-zinc-500 mt-1 text-sm sm:text-base">Welcome back! Real-time overview of your platform.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 text-xs sm:text-sm font-medium w-fit">
          <ShieldCheck size={16} className="text-emerald-500" />
          System Secure
        </div>
      </div>

      {/* Stats Grid - Adaptive Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-zinc-900/50 border border-zinc-800 p-5 sm:p-6 rounded-2xl sm:rounded-3xl hover:border-zinc-700 transition-all group relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className={`${stat.bg} ${stat.color} ${stat.border} border p-3 rounded-xl transition-transform group-hover:scale-110 shadow-lg`}>
                <stat.icon size={24} />
              </div>
            </div>
            <div className="relative z-10">
              <p className="text-zinc-500 text-xs sm:text-sm font-bold uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl sm:text-3xl font-black text-white mt-1">{stat.value}</p>
            </div>
            <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bg} blur-[80px] rounded-full -mr-16 -mt-16 opacity-20 transition-opacity group-hover:opacity-40`} />
          </div>
        ))}
        
      </div>


      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 sm:p-8 rounded-3xl shadow-2xl shadow-indigo-500/20 text-white relative overflow-hidden group">
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 border border-white/20">
              <ImageIcon size={24} />
            </div>
            <h3 className="text-xl sm:text-2xl font-black mb-2">Media System</h3>
            <p className="text-indigo-100/80 text-sm sm:text-base mb-6 leading-relaxed">Manage assets across your platform with unified Cloudinary hosting.</p>
            <Link 
              href="/admin/media-management"
              className="w-full bg-white text-indigo-600 font-bold py-3.5 rounded-2xl transition-all border border-white hover:bg-indigo-50 flex items-center justify-center gap-2 active:scale-95 shadow-xl shadow-black/10"
            >
              Launch Media Manager
              <ArrowRight size={18} />
            </Link>
          </div>
          {/* Animated bg elements */}
          <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
          <div className="absolute bottom-[-10%] left-[-10%] w-24 h-24 bg-indigo-400/20 rounded-full blur-xl group-hover:translate-x-12 transition-transform duration-1000" />
        </div>

        {/* Added Reviews Management Action Card for balance */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-800 p-6 sm:p-8 rounded-3xl shadow-2xl shadow-emerald-500/20 text-white relative overflow-hidden group">
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 border border-white/20">
              <MessageSquare size={24} />
            </div>
            <h3 className="text-xl sm:text-2xl font-black mb-2">Review Center</h3>
            <p className="text-emerald-100/80 text-sm sm:text-base mb-6 leading-relaxed">Moderate client testimonials and manage your public reputation.</p>
            <Link 
              href="/admin/reviews"
              className="w-full bg-white text-emerald-600 font-bold py-3.5 rounded-2xl transition-all border border-white hover:bg-emerald-50 flex items-center justify-center gap-2 active:scale-95 shadow-xl shadow-black/10"
            >
              Manage Testimonials
              <ArrowRight size={18} />
            </Link>
          </div>
          <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
          <div className="absolute bottom-[-10%] left-[-10%] w-24 h-24 bg-emerald-400/20 rounded-full blur-xl group-hover:translate-x-12 transition-transform duration-1000" />
        </div>
      </div>
    </div>
  );
}
