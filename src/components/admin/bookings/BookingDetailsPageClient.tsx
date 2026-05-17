'use client';

import { useBookingDetails, useDeleteBooking } from '@/hooks/useBookings';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  MapPin, 
  Sparkles, 
  Clock, 
  Phone, 
  IndianRupee, 
  PartyPopper,
  Trash2,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function BookingDetailsPageClient() {
  const { id } = useParams();
  const router = useRouter();
  const { data: booking, isLoading } = useBookingDetails(id as string);
  const { mutate: deleteBooking, isPending: isDeleting } = useDeleteBooking();

  const handleBack = () => {
    router.push('/admin/bookings');
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this booking inquiry?')) {
      deleteBooking(id as string, {
        onSuccess: () => router.push('/admin/bookings')
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-brand" size={40} />
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Loading Details...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
        <p className="text-zinc-400">Booking inquiry not found.</p>
        <button onClick={handleBack} className="text-brand font-bold flex items-center gap-2">
          <ArrowLeft size={18} /> Back to Bookings
        </button>
      </div>
    );
  }

  const DetailSection = ({ icon: Icon, title, children }: { icon: any, title: string, children: React.ReactNode }) => (
    <div className="bg-zinc-900/30 border border-zinc-800 rounded-[2rem] p-8 space-y-6 backdrop-blur-sm">
      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
        <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center">
          <Icon size={20} className="text-brand" />
        </div>
        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white">{title}</h4>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {children}
      </div>
    </div>
  );

  const DataItem = ({ label, value, fullWidth = false }: { label: string, value: any, fullWidth?: boolean }) => (
    <div className={cn("space-y-1.5", fullWidth ? "col-span-full" : "")}>
      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{label}</p>
      <p className="text-sm text-white font-medium">{value || 'N/A'}</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl sticky top-4 z-20 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleBack}
            className="p-3 bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-2xl transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Booking Details</h2>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">Ref: {booking._id.slice(-8)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-6 py-3 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-2xl transition-all text-xs font-black uppercase tracking-widest flex items-center gap-2"
          >
            {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
            Delete Inquiry
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6">
        {/* Couple Info */}
        <DetailSection icon={User} title="The Happy Couple">
          <DataItem label="Groom's Name" value={booking.groomName} />
          <DataItem label="Bride's Name" value={booking.brideName} />
        </DetailSection>

        {/* Event Logistics */}
        <DetailSection icon={Calendar} title="Event Logistics">
          <DataItem label="Function Date" value={new Date(booking.preferredFunctionDate).toLocaleDateString()} />
          <DataItem label="Location" value={booking.functionLocation} />
          <DataItem label="Venue" value={booking.venue} />
          <DataItem label="Function Days" value={booking.functionDays} />
          <DataItem label="Start Time" value={booking.functionStartTime} />
          <DataItem label="End Time" value={booking.functionEndTime} />
        </DetailSection>

        {/* Preferences */}
        <DetailSection icon={Sparkles} title="Traditions & Style">
          <DataItem label="Tradition" value={booking.weddingTradition} />
          <DataItem label="Function Type" value={booking.functionType} />
          <DataItem label="Atmosphere" value={booking.functionPlannedAt} />
          <DataItem label="Schedule" value={booking.programSchedule} />
        </DetailSection>

        {/* Additional Functions */}
        <DetailSection icon={PartyPopper} title="Additional Celebrations">
          <div className="col-span-full">
            <div className="flex flex-wrap gap-2">
              {booking.additionalFunctions.length > 0 ? (
                booking.additionalFunctions.map((f: string, i: number) => (
                  <span key={i} className="px-4 py-2 bg-brand/10 border border-brand/20 text-brand rounded-xl text-xs font-bold">
                    {f}
                  </span>
                ))
              ) : (
                <span className="text-zinc-600 text-xs italic">No additional functions selected</span>
              )}
            </div>
          </div>
        </DetailSection>

        {/* Guest & Budget */}
        <DetailSection icon={IndianRupee} title="Capacity & Budget">
          <DataItem label="Expected Guests" value={`${booking.expectedGuests} Guests`} />
          <DataItem label="Estimated Budget" value={`₹ ${booking.estimatedBudget.toLocaleString()}`} />
          <DataItem label="Special Rituals" value={booking.ritualsOrTraditions} fullWidth />
          <DataItem label="Special Suggestions" value={booking.specialSuggestions} fullWidth />
        </DetailSection>

        {/* Communication */}
        <DetailSection icon={Phone} title="Communication & Contact">
          <DataItem label="Contact Number" value={booking.contactNumber} />
          <DataItem label="WhatsApp Number" value={booking.whatsappNumber} />
          <DataItem label="Preferred Method" value={booking.preferredCommunicationMethod} />
          <DataItem label="Submitted At" value={new Date(booking.createdAt).toLocaleString()} />
        </DetailSection>
      </div>
    </div>
  );
}
