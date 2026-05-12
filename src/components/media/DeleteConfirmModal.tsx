'use client';

import { AlertTriangle, X, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeleteConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export function DeleteConfirmModal({ open, onClose, onConfirm, loading }: DeleteConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      {/* Backdrop with fade-in */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal with slide-up on mobile, zoom-in on desktop */}
      <div className="relative z-50 bg-[#09090b] border border-zinc-800 rounded-[2rem] sm:rounded-3xl p-8 w-full max-w-md shadow-2xl animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-300 ring-1 ring-white/5">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-full transition-all"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-6 shadow-inner">
            <AlertTriangle size={32} className="text-rose-500" />
          </div>
          
          <h3 className="text-2xl font-black text-white tracking-tight">Irreversible Action</h3>
          <p className="text-zinc-500 mt-2 text-sm leading-relaxed font-medium">
            You are about to permanently purge this asset from the database and Cloudinary storage. 
            <span className="block mt-1 text-rose-400 font-bold uppercase tracking-wider text-[10px]">This cannot be recovered.</span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-10">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 order-2 sm:order-1 py-3.5 text-sm font-bold text-zinc-400 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-2xl transition-all active:scale-[0.98] disabled:opacity-50"
          >
            Abort Deletion
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 order-1 sm:order-2 py-3.5 text-sm font-black text-white bg-rose-600 hover:bg-rose-500 rounded-2xl transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2 shadow-xl shadow-rose-600/20"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Trash2 size={18} />
                Delete Forever
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
