'use client';

import { useState } from 'react';
import axios from 'axios';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Save, 
  ShieldCheck,
  CheckCircle2,
  Loader2,
  KeyRound
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface SettingsClientProps {
  admin: {
    name: string;
    email: string;
    phoneNumber?: string;
  };
}

export function SettingsClient({ admin }: SettingsClientProps) {
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  
  const [profile, setProfile] = useState({
    name: admin.name,
    email: admin.email,
    phoneNumber: admin.phoneNumber || '',
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      await axios.patch('/api/admin/settings', profile);
      toast.success('Profile updated successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    setPasswordLoading(true);
    try {
      await axios.patch('/api/admin/change-password', passwords);
      toast.success('Password changed successfully');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 sm:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      {/* Page Header */}
      <div className="px-1 sm:px-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Admin Settings</h1>
        <p className="text-zinc-500 mt-1 text-sm sm:text-base">Configure your administrative profile and security protocols.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">
        {/* Profile Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-1">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center">
               <User className="text-indigo-400" size={18} />
            </div>
            <h2 className="text-lg font-bold text-white">Profile Details</h2>
          </div>
          
          <form onSubmit={handleProfileSubmit} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 space-y-6 backdrop-blur-md relative overflow-hidden group">
            <div className="space-y-5 relative z-10">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Full Identity</label>
                <div className="relative group/input">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within/input:text-indigo-500 transition-colors" size={18} />
                  <input 
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full bg-zinc-800/40 border border-zinc-700/50 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all text-sm"
                    placeholder="Official Name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Communication Email</label>
                <div className="relative group/input">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within/input:text-indigo-500 transition-colors" size={18} />
                  <input 
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full bg-zinc-800/40 border border-zinc-700/50 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all text-sm"
                    placeholder="admin@platform.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Mobile Contact</label>
                <div className="relative group/input">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within/input:text-indigo-500 transition-colors" size={18} />
                  <input 
                    type="tel"
                    value={profile.phoneNumber}
                    onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
                    className="w-full bg-zinc-800/40 border border-zinc-700/50 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all text-sm"
                    placeholder="+1 (000) 000-0000"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={profileLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl shadow-indigo-600/20 relative z-10 border border-indigo-400/30"
            >
              {profileLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              Update Identity Profile
            </button>
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />
          </form>
        </div>

        {/* Security Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-1">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center">
               <ShieldCheck className="text-emerald-400" size={18} />
            </div>
            <h2 className="text-lg font-bold text-white">System Security</h2>
          </div>
          
          <form onSubmit={handlePasswordSubmit} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 space-y-6 backdrop-blur-md relative overflow-hidden group">
            <div className="space-y-5 relative z-10">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Current Protocol Key</label>
                <div className="relative group/input">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within/input:text-emerald-500 transition-colors" size={18} />
                  <input 
                    type="password"
                    value={passwords.currentPassword}
                    onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                    className="w-full bg-zinc-800/40 border border-zinc-700/50 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all text-sm"
                    placeholder="Verification Required"
                  />
                </div>
              </div>

              <div className="h-px bg-zinc-800/50 my-2 shadow-inner" />

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">New Security Pass</label>
                <div className="relative group/input">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within/input:text-emerald-500 transition-colors" size={18} />
                  <input 
                    type="password"
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                    className="w-full bg-zinc-800/40 border border-zinc-700/50 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all text-sm"
                    placeholder="New Credentials"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Validation Repeat</label>
                <div className="relative group/input">
                  <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within/input:text-emerald-500 transition-colors" size={18} />
                  <input 
                    type="password"
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                    className="w-full bg-zinc-800/40 border border-zinc-700/50 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all text-sm"
                    placeholder="Confirm Credentials"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={passwordLoading}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-4 rounded-2xl border border-zinc-700 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 relative z-10"
            >
              {passwordLoading ? <Loader2 className="animate-spin" size={20} /> : <Lock size={20} />}
              Rotate Access Key
            </button>
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />
          </form>
        </div>
      </div>
      
      {/* Account Info Badge */}
      <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-4 text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] text-center sm:text-left">
        <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center flex-shrink-0">
           <ShieldCheck size={18} className="text-indigo-400" />
        </div>
        Your administrative session is protected by multi-layer encryption and HTTP-only cookie tokens. Ensure your local machine is secure.
      </div>
    </div>
  );
}
