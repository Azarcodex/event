'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminBookings, useDeleteBooking } from '@/hooks/useBookings';
import { 
  Search, 
  Trash2, 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  Loader2, 
  Calendar,
  Users,
  IndianRupee,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { IBooking } from '@/types/booking';

export default function BookingsManagementClient() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  const limit = 10;
  
  const { data, isLoading } = useAdminBookings(page, limit, debouncedSearch);
  const { mutate: deleteBooking, isPending: isDeleting } = useDeleteBooking();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    // Debounce search manually or with a library. Simple timeout for now.
    const timeout = setTimeout(() => setDebouncedSearch(e.target.value), 500);
    return () => clearTimeout(timeout);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this booking inquiry?')) {
      deleteBooking(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative max-w-md group">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-brand transition-colors" />
        <input 
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            // Simple immediate debounced effect
          }}
          onKeyUp={(e) => {
            if (e.key === 'Enter') setDebouncedSearch(search);
          }}
          onBlur={() => setDebouncedSearch(search)}
          placeholder="Search by name, location..."
          className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:border-brand/50 focus:ring-4 focus:ring-brand/5 transition-all outline-none"
        />
      </div>

      {/* Table Container */}
      <div className="bg-zinc-900/30 border border-zinc-800 rounded-[2.5rem] overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/20">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Couple</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Event</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Contact</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center">Guests</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Budget</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              <AnimatePresence mode="popLayout">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <Loader2 className="animate-spin text-brand" size={32} />
                        <span className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Loading Bookings...</span>
                      </div>
                    </td>
                  </tr>
                ) : data?.bookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-4 text-zinc-600">
                        <Calendar size={48} className="opacity-20" />
                        <span className="font-bold uppercase tracking-widest text-xs">No bookings found</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  data?.bookings.map((booking: IBooking) => (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={booking._id} 
                      className="hover:bg-zinc-800/20 transition-colors group"
                    >
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-white font-bold">{booking.groomName} &</span>
                          <span className="text-white font-bold">{booking.brideName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1">
                          <span className="text-white text-sm font-medium">{booking.functionType}</span>
                          <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
                            {new Date(booking.preferredFunctionDate).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1">
                          <span className="text-zinc-300 text-sm">{booking.contactNumber}</span>
                          <span className="text-zinc-500 text-[10px] font-bold">{booking.preferredCommunicationMethod}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className="px-3 py-1 bg-zinc-800 rounded-full text-white text-xs font-bold">
                          {booking.expectedGuests}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-1.5 text-brand font-black text-sm">
                          <IndianRupee size={14} />
                          {booking.estimatedBudget.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-2">
                          <Link 
                            href={`/admin/bookings/${booking._id}`}
                            className="p-2.5 bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-xl transition-all"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </Link>
                          <button 
                            onClick={() => handleDelete(booking._id)}
                            className="p-2.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all"
                            title="Delete Booking"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {data && data.pages > 1 && (
          <div className="px-6 py-5 border-t border-zinc-800 flex items-center justify-between bg-zinc-950/20">
            <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest">
              Page {page} of {data.pages}
            </span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 bg-zinc-800 text-zinc-400 rounded-xl disabled:opacity-20 hover:bg-zinc-700 transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={() => setPage(p => Math.min(data.pages, p + 1))}
                disabled={page === data.pages}
                className="p-2 bg-zinc-800 text-zinc-400 rounded-xl disabled:opacity-20 hover:bg-zinc-700 transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
