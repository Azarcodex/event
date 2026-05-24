'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminBookings, useDeleteBooking, useUpdateBookingFields } from '@/hooks/useBookings';
import { 
  Trash2, 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  Loader2, 
  Calendar,
  IndianRupee,
  Search,
  Filter
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { IBooking } from '@/types/booking';
import { BOOKING_STATUSES, BOOKING_SERVICES, BookingStatus } from '@/types/booking';

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'Event Confirm':
      return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
    case 'Full Advance':
      return 'bg-teal-500/10 border-teal-500/20 text-teal-400';
    case 'Advance':
      return 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400';
    case 'Verbal Commitment':
      return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
    case 'Followup':
      return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
    case 'Contacted':
      return 'bg-sky-500/10 border-sky-500/20 text-sky-400';
    case '1 st meeting done':
    case '2 nd meeting done':
      return 'bg-purple-500/10 border-purple-500/20 text-purple-400';
    case 'Contact Watsapp':
      return 'bg-green-500/10 border-green-500/20 text-green-400';
    case 'Meeting Recheduled':
      return 'bg-violet-500/10 border-violet-500/20 text-violet-400';
    case 'Not Interested':
    case 'Bad Fit for us':
    case 'Not responding':
      return 'bg-rose-500/10 border-rose-500/20 text-rose-400';
    case 'Cancelled':
      return 'bg-zinc-500/10 border-zinc-500/20 text-zinc-400';
    default:
      return 'bg-zinc-800 border-zinc-700 text-zinc-400';
  }
};

export default function BookingsManagementClient() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [serviceFilter, setServiceFilter] = useState<string>('All');
  const [activeServicesDropdownId, setActiveServicesDropdownId] = useState<string | null>(null);
  const [dropdownCoords, setDropdownCoords] = useState<{ top: number; left: number } | null>(null);
  
  const limit = 10;
  
  const { data, isLoading } = useAdminBookings(page, limit, search, statusFilter, serviceFilter);
  const { mutate: deleteBooking } = useDeleteBooking();
  const { mutate: updateBooking } = useUpdateBookingFields();

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this booking inquiry?')) {
      deleteBooking(id);
    }
  };

  const handleStatusChange = (id: string, newStatus: BookingStatus) => {
    updateBooking({ id, data: { status: newStatus } });
  };

  const handleServiceToggle = (id: string, currentServices: string[], service: string) => {
    const newServices = currentServices.includes(service)
      ? currentServices.filter((s) => s !== service)
      : [...currentServices, service];
    updateBooking({ id, data: { services: newServices } });
  };

  const handleServicesClick = (e: React.MouseEvent<HTMLButtonElement>, bookingId: string) => {
    if (activeServicesDropdownId === bookingId) {
      setActiveServicesDropdownId(null);
      setDropdownCoords(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      setDropdownCoords({
        top: rect.bottom + window.scrollY + 6,
        left: rect.left + window.scrollX,
      });
      setActiveServicesDropdownId(bookingId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-zinc-900/40 border border-zinc-800 p-4 rounded-3xl backdrop-blur-sm">
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-505 text-zinc-500" />
          <input
            type="text"
            placeholder="Search couple, city, phone..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-zinc-700 transition-all"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl px-4 py-3 text-sm text-zinc-400 outline-none focus:border-zinc-700 transition-all cursor-pointer appearance-none"
          >
            <option value="All" className="bg-zinc-950 text-white">All Statuses</option>
            {BOOKING_STATUSES.map((status) => (
              <option key={status} value={status} className="bg-zinc-950 text-white">
                {status}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 text-xs font-black">▼</div>
        </div>

        {/* Service Filter */}
        <div className="relative">
          <select
            value={serviceFilter}
            onChange={(e) => {
              setServiceFilter(e.target.value);
              setPage(1);
            }}
            className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl px-4 py-3 text-sm text-zinc-400 outline-none focus:border-zinc-700 transition-all cursor-pointer appearance-none"
          >
            <option value="All" className="bg-zinc-950 text-white">All Services</option>
            {BOOKING_SERVICES.map((service) => (
              <option key={service} value={service} className="bg-zinc-950 text-white">
                {service}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 text-xs font-black">▼</div>
        </div>
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
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Services</th>
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
                  data?.bookings.map((booking: IBooking) => {
                    // Safe legacy mapping for old status fields
                    const normalizedStatus = (
                      booking.status === ('Pending' as any)
                        ? 'Followup'
                        : booking.status === ('Completed' as any)
                        ? 'Event Confirm'
                        : booking.status || 'Followup'
                    ) as BookingStatus;

                    return (
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
                        <td className="px-6 py-5">
                          <div 
                            onClick={(e) => handleServicesClick(e as any, booking._id)}
                            className="inline-flex flex-wrap items-center gap-1.5 max-w-[200px] cursor-pointer hover:bg-zinc-800/40 p-1.5 rounded-2xl border border-zinc-800/80 bg-zinc-950/40 transition-all select-none group"
                          >
                            {booking.services && booking.services.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {booking.services.map((service, idx) => (
                                  <span 
                                    key={idx} 
                                    className="px-2 py-0.5 bg-brand/10 border border-brand/20 text-brand rounded-lg text-[9px] font-bold uppercase tracking-wider whitespace-nowrap"
                                  >
                                    {service}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest px-2 py-1">Select Services</span>
                            )}
                            <span className="text-[8px] text-zinc-500 group-hover:text-zinc-350 ml-1 transition-colors pr-1">▼</span>
                          </div>

                          {/* Floating Services Selector via React Portal */}
                          {activeServicesDropdownId === booking._id && dropdownCoords && typeof window !== 'undefined' && createPortal(
                            <>
                              <div className="fixed inset-0 z-40 animate-none" onClick={() => {
                                setActiveServicesDropdownId(null);
                                setDropdownCoords(null);
                              }} />
                              <div 
                                style={{ 
                                  position: 'absolute',
                                  top: dropdownCoords.top, 
                                  left: dropdownCoords.left 
                                }}
                                className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 w-56 shadow-2xl z-50 space-y-2 animate-in fade-in slide-in-from-top-2 duration-150"
                              >
                                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-2 pb-1 border-b border-zinc-900">Select Services</p>
                                <div className="max-h-48 overflow-y-auto space-y-1.5 scrollbar-thin">
                                  {BOOKING_SERVICES.map((service) => {
                                    const isSelected = booking.services?.includes(service);
                                    return (
                                      <label 
                                        key={service} 
                                        className="flex items-center gap-2 px-2 py-1.5 hover:bg-zinc-900 rounded-lg cursor-pointer text-xs text-zinc-300 select-none"
                                      >
                                        <input
                                          type="checkbox"
                                          checked={isSelected}
                                          onChange={() => handleServiceToggle(booking._id, booking.services || [], service)}
                                          className="accent-brand rounded cursor-pointer animate-none"
                                        />
                                        <span>{service}</span>
                                      </label>
                                    );
                                  })}
                                </div>
                              </div>
                            </>,
                            document.body
                          )}
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-1.5 text-brand font-black text-sm">
                            <IndianRupee size={14} />
                            {booking.estimatedBudget.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <select
                            value={normalizedStatus}
                            onChange={(e) => handleStatusChange(booking._id, e.target.value as BookingStatus)}
                            className={cn(
                              "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all cursor-pointer bg-zinc-950 text-white outline-none focus:ring-1 focus:ring-brand/50",
                              getStatusColor(normalizedStatus)
                            )}
                          >
                            {BOOKING_STATUSES.map((status) => (
                              <option key={status} value={status} className="bg-zinc-950 text-zinc-300 font-sans normal-case tracking-normal">
                                {status}
                              </option>
                            ))}
                          </select>
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
                    );
                  })
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
