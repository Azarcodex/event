'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminBookings, useDeleteBooking, useUpdateBookingStatus } from '@/hooks/useBookings';
import { 
  Trash2, 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  Loader2, 
  Calendar,
  IndianRupee,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { IBooking } from '@/types/booking';

export default function BookingsManagementClient() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<'All' | 'Completed' | 'Not Completed'>('All');
  
  const limit = 10;
  
  const { data, isLoading } = useAdminBookings(page, limit, '', filter);
  const { mutate: deleteBooking } = useDeleteBooking();
  const { mutate: updateStatus } = useUpdateBookingStatus();

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this booking inquiry?')) {
      deleteBooking(id);
    }
  };

  const handleToggleStatus = (id: string, currentStatus?: 'Pending' | 'Completed') => {
    const newStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
    
    const message = newStatus === 'Completed'
      ? 'Are you sure you want to mark this booking as Completed?'
      : 'Are you sure you want to mark this booking as Not Completed (Pending)?';
      
    if (confirm(message)) {
      updateStatus({ id, status: newStatus });
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex border-b border-zinc-800/80 gap-6">
        {[
          { label: 'All Bookings', value: 'All' },
          { label: 'Completed', value: 'Completed' },
          { label: 'Not Completed', value: 'Not Completed' }
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => {
              setFilter(tab.value as any);
              setPage(1);
            }}
            className={cn(
              "pb-4 px-2 text-xs font-black uppercase tracking-widest border-b-2 transition-all cursor-pointer outline-none",
              filter === tab.value
                ? "border-brand text-brand"
                : "border-transparent text-zinc-500 hover:text-zinc-300"
            )}
          >
            {tab.label}
          </button>
        ))}
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
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Status</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              <AnimatePresence mode="popLayout">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <Loader2 className="animate-spin text-brand" size={32} />
                        <span className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Loading Bookings...</span>
                      </div>
                    </td>
                  </tr>
                ) : data?.bookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-20 text-center">
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
                        <button
                          onClick={() => handleToggleStatus(booking._id, booking.status)}
                          className={cn(
                            "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all flex items-center gap-2 cursor-pointer",
                            booking.status === 'Completed'
                              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-black hover:border-emerald-500"
                              : "bg-zinc-800/30 border-zinc-800 text-zinc-500 hover:border-zinc-750 hover:text-zinc-300"
                          )}
                        >
                          {booking.status === 'Completed' ? (
                            <>
                              <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                              Completed
                            </>
                          ) : (
                            <>
                              <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 shrink-0" />
                              Not Completed
                            </>
                          )}
                        </button>
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
