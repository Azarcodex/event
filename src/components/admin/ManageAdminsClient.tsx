'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, 
  Plus, 
  Shield, 
  Lock, 
  Mail, 
  User, 
  Edit2, 
  Trash2, 
  Check, 
  X, 
  Loader2, 
  FileText,
  Calendar,
  Layers,
  Search,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'superadmin';
  permissions: ('media_management' | 'bookings_management')[];
  status: 'active' | 'inactive';
  phoneNumber?: string;
  createdAt: string;
}

interface ManageAdminsClientProps {
  currentAdmin: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export function ManageAdminsClient({ currentAdmin }: ManageAdminsClientProps) {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);

  // Form states
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Create form state
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    password: '',
    permissions: [] as ('media_management' | 'bookings_management')[],
  });

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    password: '',
    permissions: [] as ('media_management' | 'bookings_management')[],
    status: 'active' as 'active' | 'inactive',
  });

  // Load admins
  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/admins');
      setAdmins(res.data.admins || []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to load admins');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Filtered Admins
  const filteredAdmins = admins.filter(admin => 
    admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Create Submit
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name.trim() || !createForm.email.trim() || !createForm.password.trim()) {
      toast.error('All required fields must be filled');
      return;
    }
    if (createForm.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      setSubmitting(true);
      await axios.post('/api/admin/admins', createForm);
      toast.success('Admin created successfully');
      setShowCreateModal(false);
      setCreateForm({
        name: '',
        email: '',
        password: '',
        permissions: [],
      });
      fetchAdmins();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create admin');
    } finally {
      setSubmitting(false);
    }
  };

  // Edit Click
  const handleEditClick = (admin: AdminUser) => {
    setSelectedAdmin(admin);
    setEditForm({
      name: admin.name,
      email: admin.email,
      password: '',
      permissions: admin.permissions || [],
      status: admin.status || 'active',
    });
    setShowEditModal(true);
  };

  // Edit Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdmin) return;
    if (!editForm.name.trim() || !editForm.email.trim()) {
      toast.error('Name and email are required');
      return;
    }
    if (editForm.password && editForm.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      setSubmitting(true);
      await axios.put(`/api/admin/admins/${selectedAdmin.id}`, editForm);
      toast.success('Admin updated successfully');
      setShowEditModal(false);
      setSelectedAdmin(null);
      fetchAdmins();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update admin');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Click
  const handleDeleteClick = (admin: AdminUser) => {
    if (admin.id === currentAdmin.id) {
      toast.error('You cannot delete your own account');
      return;
    }
    setSelectedAdmin(admin);
    setShowDeleteModal(true);
  };

  // Delete Confirm
  const handleDeleteConfirm = async () => {
    if (!selectedAdmin) return;
    try {
      setSubmitting(true);
      await axios.delete(`/api/admin/admins/${selectedAdmin.id}`);
      toast.success('Admin deleted successfully');
      setShowDeleteModal(false);
      setSelectedAdmin(null);
      fetchAdmins();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete admin');
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle permission helper
  const handlePermissionToggle = (
    type: 'create' | 'edit',
    permission: 'media_management' | 'bookings_management'
  ) => {
    if (type === 'create') {
      setCreateForm(prev => {
        const permissions = prev.permissions.includes(permission)
          ? prev.permissions.filter(p => p !== permission)
          : [...prev.permissions, permission];
        return { ...prev, permissions };
      });
    } else {
      setEditForm(prev => {
        const permissions = prev.permissions.includes(permission)
          ? prev.permissions.filter(p => p !== permission)
          : [...prev.permissions, permission];
        return { ...prev, permissions };
      });
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/40 p-4 rounded-3xl border border-zinc-800/40 backdrop-blur-sm">
        <div className="relative flex-1 max-w-md group">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
          <input
            type="text"
            placeholder="Search admins by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#09090b]/80 border border-zinc-800 rounded-2xl py-3 pl-11 pr-4 outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all text-sm text-zinc-300 placeholder:text-zinc-600"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-5 rounded-2xl transition-all shadow-xl shadow-indigo-600/10 hover:shadow-indigo-500/20 active:scale-95 text-xs uppercase tracking-widest self-stretch sm:self-auto"
        >
          <Plus size={16} />
          Create Admin
        </button>
      </div>

      {/* Main List */}
      {loading ? (
        <div className="py-32 flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
            <Loader2 size={24} className="text-indigo-500 absolute inset-0 m-auto animate-pulse" />
          </div>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[10px]">Loading Admins...</p>
        </div>
      ) : filteredAdmins.length === 0 ? (
        <div className="py-24 flex flex-col items-center gap-6 bg-zinc-900/10 rounded-[3rem] border border-dashed border-zinc-800/50">
          <div className="w-20 h-20 bg-zinc-900/50 rounded-3xl flex items-center justify-center border border-zinc-800 text-zinc-700">
            <Users size={40} />
          </div>
          <div className="text-center space-y-2">
            <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">No admins found</p>
            <p className="text-zinc-600 text-xs">Try adjusting your search query or add a new admin.</p>
          </div>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-hidden bg-zinc-900/30 border border-zinc-800/50 rounded-3xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800/50 bg-[#09090b]/50">
                    <th className="py-4.5 px-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Name / Email</th>
                    <th className="py-4.5 px-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">System Role</th>
                    <th className="py-4.5 px-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Permissions</th>
                    <th className="py-4.5 px-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Status</th>
                    <th className="py-4.5 px-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Joined Date</th>
                    <th className="py-4.5 px-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/30">
                  {filteredAdmins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-zinc-800/10 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-white border border-zinc-700 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-10" />
                            <User size={18} className="text-zinc-400 group-hover:text-white transition-colors" />
                          </div>
                          <div>
                            <p className="font-semibold text-white text-sm leading-snug">{admin.name}</p>
                            <p className="text-xs text-zinc-500 leading-normal">{admin.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {admin.role === 'superadmin' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 border border-amber-500/20 text-amber-400">
                            <Shield size={10} />
                            Super Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-800 border border-zinc-700 text-zinc-400">
                            Admin
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        {admin.role === 'superadmin' ? (
                          <span className="text-xs text-zinc-500 italic">Full System Access</span>
                        ) : admin.permissions.length === 0 ? (
                          <span className="text-xs text-rose-400/70 italic flex items-center gap-1">
                            <AlertCircle size={12} />
                            No Permissions Assigned
                          </span>
                        ) : (
                          <div className="flex flex-wrap gap-1.5">
                            {admin.permissions.includes('media_management') && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                                <Layers size={10} />
                                Media
                              </span>
                            )}
                            {admin.permissions.includes('bookings_management') && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                <Calendar size={10} />
                                Bookings
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <span className={cn(
                          "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                          admin.status === 'active' 
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                            : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                        )}>
                          <span className={cn(
                            "w-1 h-1 rounded-full",
                            admin.status === 'active' ? "bg-emerald-400" : "bg-rose-400"
                          )} />
                          {admin.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-zinc-500 text-xs">
                        {new Date(admin.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEditClick(admin)}
                            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl border border-transparent hover:border-zinc-700 transition-all"
                            title="Edit Permissions"
                          >
                            <Edit2 size={15} />
                          </button>
                          {admin.role !== 'superadmin' && (
                            <button
                              onClick={() => handleDeleteClick(admin)}
                              className="p-2 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/5 rounded-xl border border-transparent hover:border-rose-500/10 transition-all"
                              title="Delete Admin"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile & Tablet Card View */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
            {filteredAdmins.map((admin) => (
              <div key={admin.id} className="bg-zinc-900/30 border border-zinc-800/50 p-5 rounded-3xl space-y-4 group">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-white border border-zinc-700 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-10" />
                      <User size={18} className="text-zinc-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm leading-snug">{admin.name}</p>
                      <p className="text-xs text-zinc-500 leading-normal">{admin.email}</p>
                    </div>
                  </div>

                  <span className={cn(
                    "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                    admin.status === 'active' 
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                      : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                  )}>
                    {admin.status}
                  </span>
                </div>

                <div className="pt-3 border-t border-zinc-800/50 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">System Role</p>
                    {admin.role === 'superadmin' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase bg-amber-500/10 border border-amber-500/20 text-amber-400">
                        <Shield size={9} />
                        Super Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase bg-zinc-800 border border-zinc-700 text-zinc-400">
                        Admin
                      </span>
                    )}
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Permissions</p>
                    {admin.role === 'superadmin' ? (
                      <span className="text-[10px] text-zinc-500 italic">Full Access</span>
                    ) : admin.permissions.length === 0 ? (
                      <span className="text-[10px] text-rose-400/70 italic">None</span>
                    ) : (
                      <div className="flex gap-1">
                        {admin.permissions.includes('media_management') && (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[9px] font-bold uppercase">
                            Media
                          </span>
                        )}
                        {admin.permissions.includes('bookings_management') && (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold uppercase">
                            Bookings
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-800/50 flex items-center justify-between">
                  <span className="text-[10px] text-zinc-600">
                    Joined: {new Date(admin.createdAt).toLocaleDateString()}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditClick(admin)}
                      className="p-2 text-zinc-400 hover:text-white bg-zinc-800/40 hover:bg-zinc-800 rounded-xl border border-zinc-800 transition-all text-xs flex items-center gap-1.5 px-3 py-1.5"
                    >
                      <Edit2 size={13} />
                      Edit
                    </button>
                    {admin.role !== 'superadmin' && (
                      <button
                        onClick={() => handleDeleteClick(admin)}
                        className="p-2 text-zinc-500 hover:text-rose-400 bg-zinc-800/10 hover:bg-rose-500/5 rounded-xl border border-zinc-800/10 hover:border-rose-500/10 transition-all text-xs flex items-center gap-1.5 px-3 py-1.5"
                      >
                        <Trash2 size={13} />
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modals and Overlays using AnimatePresence */}
      <AnimatePresence>
        {/* CREATE MODAL */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setShowCreateModal(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative z-10 w-full max-w-md bg-[#18181b] border border-zinc-800 p-6 sm:p-8 rounded-[2rem] shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800/50">
                <div className="flex items-center gap-2">
                  <Users className="text-indigo-500" size={20} />
                  <h3 className="text-lg font-bold text-white">Create New Admin</h3>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-zinc-500 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">Full Name</label>
                  <div className="relative group">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={createForm.name}
                      onChange={(e) => setCreateForm(p => ({ ...p, name: e.target.value }))}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all text-sm text-zinc-300 placeholder:text-zinc-600"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                      type="email"
                      required
                      placeholder="jane.doe@example.com"
                      value={createForm.email}
                      onChange={(e) => setCreateForm(p => ({ ...p, email: e.target.value }))}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all text-sm text-zinc-300 placeholder:text-zinc-600"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">Password</label>
                  <div className="relative group">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={createForm.password}
                      onChange={(e) => setCreateForm(p => ({ ...p, password: e.target.value }))}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-12 outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all text-sm text-zinc-300 placeholder:text-zinc-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-all p-1"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1 block">Role Permissions</label>
                  
                  <div className="grid grid-cols-1 gap-2.5">
                    {/* Media Toggle */}
                    <div 
                      onClick={() => handlePermissionToggle('create', 'media_management')}
                      className={cn(
                        "flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer select-none transition-all duration-200",
                        createForm.permissions.includes('media_management')
                          ? "bg-indigo-600/10 border-indigo-500/40 text-white"
                          : "bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:border-zinc-700"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-xl border transition-colors",
                          createForm.permissions.includes('media_management')
                            ? "bg-indigo-600/20 border-indigo-500/40 text-indigo-400"
                            : "bg-zinc-800 border-zinc-700 text-zinc-500"
                        )}>
                          <Layers size={16} />
                        </div>
                        <div className="text-left">
                          <p className={cn("text-xs font-bold transition-colors", createForm.permissions.includes('media_management') ? "text-white" : "text-zinc-400")}>
                            Media Management
                          </p>
                          <p className="text-[10px] text-zinc-500 leading-none mt-1">Manage media and home banners</p>
                        </div>
                      </div>
                      <div className={cn(
                        "w-5 h-5 rounded-lg border flex items-center justify-center transition-all",
                        createForm.permissions.includes('media_management')
                          ? "bg-indigo-600 border-indigo-500 text-white"
                          : "border-zinc-700 bg-zinc-900"
                      )}>
                        {createForm.permissions.includes('media_management') && <Check size={12} strokeWidth={3} />}
                      </div>
                    </div>

                    {/* Bookings Toggle */}
                    <div 
                      onClick={() => handlePermissionToggle('create', 'bookings_management')}
                      className={cn(
                        "flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer select-none transition-all duration-200",
                        createForm.permissions.includes('bookings_management')
                          ? "bg-emerald-600/10 border-emerald-500/40 text-white"
                          : "bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:border-zinc-700"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-xl border transition-colors",
                          createForm.permissions.includes('bookings_management')
                            ? "bg-emerald-600/20 border-emerald-500/40 text-emerald-400"
                            : "bg-zinc-800 border-zinc-700 text-zinc-500"
                        )}>
                          <Calendar size={16} />
                        </div>
                        <div className="text-left">
                          <p className={cn("text-xs font-bold transition-colors", createForm.permissions.includes('bookings_management') ? "text-white" : "text-zinc-400")}>
                            Bookings Management
                          </p>
                          <p className="text-[10px] text-zinc-500 leading-none mt-1">Manage bookings and client reviews</p>
                        </div>
                      </div>
                      <div className={cn(
                        "w-5 h-5 rounded-lg border flex items-center justify-center transition-all",
                        createForm.permissions.includes('bookings_management')
                          ? "bg-emerald-600 border-emerald-500 text-white"
                          : "border-zinc-700 bg-zinc-900"
                      )}>
                        {createForm.permissions.includes('bookings_management') && <Check size={12} strokeWidth={3} />}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-zinc-800/50">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 py-3 text-xs font-bold uppercase tracking-wider text-zinc-400 bg-zinc-900 hover:bg-zinc-800 hover:text-white border border-zinc-800 rounded-2xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 text-xs font-bold uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-500 rounded-2xl shadow-lg shadow-indigo-600/10 active:scale-95 transition flex items-center justify-center gap-2"
                  >
                    {submitting && <Loader2 size={14} className="animate-spin" />}
                    Create Admin
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* EDIT MODAL */}
        {showEditModal && selectedAdmin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setShowEditModal(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative z-10 w-full max-w-md bg-[#18181b] border border-zinc-800 p-6 sm:p-8 rounded-[2rem] shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800/50">
                <div className="flex items-center gap-2">
                  <Edit2 className="text-indigo-500" size={18} />
                  <h3 className="text-lg font-bold text-white">Edit Admin Account</h3>
                </div>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-zinc-500 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">Full Name</label>
                  <div className="relative group">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                      type="text"
                      required
                      placeholder="Name"
                      value={editForm.name}
                      onChange={(e) => setEditForm(p => ({ ...p, name: e.target.value }))}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all text-sm text-zinc-300 placeholder:text-zinc-600"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                      type="email"
                      required
                      placeholder="Email"
                      value={editForm.email}
                      onChange={(e) => setEditForm(p => ({ ...p, email: e.target.value }))}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all text-sm text-zinc-300 placeholder:text-zinc-600"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">New Password</label>
                    <span className="text-[10px] text-zinc-500 font-medium">Leave blank to keep current</span>
                  </div>
                  <div className="relative group">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={editForm.password}
                      onChange={(e) => setEditForm(p => ({ ...p, password: e.target.value }))}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-12 outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all text-sm text-zinc-300 placeholder:text-zinc-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-all p-1"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Status Toggle (Show only for non-self accounts, Super Admin status is always active) */}
                {selectedAdmin.id !== currentAdmin.id && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">Account Status</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setEditForm(p => ({ ...p, status: 'active' }))}
                        className={cn(
                          "flex-1 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all select-none",
                          editForm.status === 'active'
                            ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                            : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700"
                        )}
                      >
                        Active
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditForm(p => ({ ...p, status: 'inactive' }))}
                        className={cn(
                          "flex-1 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all select-none",
                          editForm.status === 'inactive'
                            ? "bg-rose-500/10 border-rose-500/40 text-rose-400"
                            : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700"
                        )}
                      >
                        Inactive
                      </button>
                    </div>
                  </div>
                )}

                {/* Permissions (Disable if selected admin is a superadmin) */}
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1 block">Role Permissions</label>
                  
                  {selectedAdmin.role === 'superadmin' ? (
                    <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-center text-xs text-zinc-500 italic">
                      Super Admin has full system access which cannot be restricted.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-2.5">
                      {/* Media Toggle */}
                      <div 
                        onClick={() => handlePermissionToggle('edit', 'media_management')}
                        className={cn(
                          "flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer select-none transition-all duration-200",
                          editForm.permissions.includes('media_management')
                            ? "bg-indigo-600/10 border-indigo-500/40 text-white"
                            : "bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:border-zinc-700"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "p-2 rounded-xl border transition-colors",
                            editForm.permissions.includes('media_management')
                              ? "bg-indigo-600/20 border-indigo-500/40 text-indigo-400"
                              : "bg-zinc-800 border-zinc-700 text-zinc-500"
                          )}>
                            <Layers size={16} />
                          </div>
                          <div className="text-left">
                            <p className={cn("text-xs font-bold transition-colors", editForm.permissions.includes('media_management') ? "text-white" : "text-zinc-400")}>
                              Media Management
                            </p>
                            <p className="text-[10px] text-zinc-500 leading-none mt-1">Manage media and home banners</p>
                          </div>
                        </div>
                        <div className={cn(
                          "w-5 h-5 rounded-lg border flex items-center justify-center transition-all",
                          editForm.permissions.includes('media_management')
                            ? "bg-indigo-600 border-indigo-500 text-white"
                            : "border-zinc-700 bg-zinc-900"
                        )}>
                          {editForm.permissions.includes('media_management') && <Check size={12} strokeWidth={3} />}
                        </div>
                      </div>

                      {/* Bookings Toggle */}
                      <div 
                        onClick={() => handlePermissionToggle('edit', 'bookings_management')}
                        className={cn(
                          "flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer select-none transition-all duration-200",
                          editForm.permissions.includes('bookings_management')
                            ? "bg-emerald-600/10 border-emerald-500/40 text-white"
                            : "bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:border-zinc-700"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "p-2 rounded-xl border transition-colors",
                            editForm.permissions.includes('bookings_management')
                              ? "bg-emerald-600/20 border-emerald-500/40 text-emerald-400"
                              : "bg-zinc-800 border-zinc-700 text-zinc-500"
                          )}>
                            <Calendar size={16} />
                          </div>
                          <div className="text-left">
                            <p className={cn("text-xs font-bold transition-colors", editForm.permissions.includes('bookings_management') ? "text-white" : "text-zinc-400")}>
                              Bookings Management
                            </p>
                            <p className="text-[10px] text-zinc-500 leading-none mt-1">Manage bookings and client reviews</p>
                          </div>
                        </div>
                        <div className={cn(
                          "w-5 h-5 rounded-lg border flex items-center justify-center transition-all",
                          editForm.permissions.includes('bookings_management')
                            ? "bg-emerald-600 border-emerald-500 text-white"
                            : "border-zinc-700 bg-zinc-900"
                        )}>
                          {editForm.permissions.includes('bookings_management') && <Check size={12} strokeWidth={3} />}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4 border-t border-zinc-800/50">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 py-3 text-xs font-bold uppercase tracking-wider text-zinc-400 bg-zinc-900 hover:bg-zinc-800 hover:text-white border border-zinc-800 rounded-2xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 text-xs font-bold uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-500 rounded-2xl shadow-lg shadow-indigo-600/10 active:scale-95 transition flex items-center justify-center gap-2"
                  >
                    {submitting && <Loader2 size={14} className="animate-spin" />}
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* DELETE MODAL */}
        {showDeleteModal && selectedAdmin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
              onClick={() => setShowDeleteModal(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-sm bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] shadow-2xl text-center"
            >
              <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} />
              </div>
              
              <h3 className="text-base font-bold text-white mb-2">Delete Admin Account</h3>
              <p className="text-zinc-400 text-xs leading-relaxed mb-6">
                Are you sure you want to delete <span className="font-semibold text-zinc-200">{selectedAdmin.name}</span>? This action is permanent and cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold rounded-xl text-xs uppercase tracking-wider transition border border-zinc-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={submitting}
                  className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl text-xs uppercase tracking-wider transition shadow-lg shadow-rose-600/15 active:scale-95 flex items-center justify-center gap-1.5"
                >
                  {submitting && <Loader2 size={12} className="animate-spin" />}
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
