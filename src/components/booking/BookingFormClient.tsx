'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { bookingSchema, BookingInput } from '@/lib/validators/booking.validator';
import { useCreateBooking } from '@/hooks/useBookings';
import { cn } from '@/lib/utils';
import { 
  Users, 
  Calendar, 
  Clock, 
  MapPin, 
  Heart, 
  Sparkles, 
  IndianRupee, 
  Phone, 
  CheckCircle2, 
  ChevronRight, 
  Loader2, 
  PartyPopper,
  Info
} from 'lucide-react';

const ADDON_FUNCTIONS = [
  'Mehandhi', 'Haldi', 'Carnival Night', 'Sangeet', 'Arabic Night', 
  'Punjabi Night', 'Dholki Night', 'Groom To Be', 'Bride To Be', 
  'Arikuth', 'Madhuram Veppu', 'Chandam Charthu', 'Engagement'
];

export default function BookingFormClient() {
  const { mutate: submitBooking, isPending, isSuccess } = useCreateBooking();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema) as any,
    mode: 'onChange',
    defaultValues: {
      additionalFunctions: [],
      expectedGuests: 100,
      estimatedBudget: 500000,
    },
  });

  const selectedAddons = watch('additionalFunctions');
  const weddingTradition = watch('weddingTradition');
  const functionType = watch('functionType');
  const functionDays = watch('functionDays');
  const functionPlannedAt = watch('functionPlannedAt');
  const programSchedule = watch('programSchedule');
  const preferredComm = watch('preferredCommunicationMethod');

  const onSubmit = (data: BookingInput) => {
    submitBooking(data);
  };

  const toggleAddon = (addon: string) => {
    const current = selectedAddons || [];
    if (current.includes(addon)) {
      setValue('additionalFunctions', current.filter(a => a !== addon));
    } else {
      setValue('additionalFunctions', [...current, addon]);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-zinc-900/50 border border-brand/20 p-12 rounded-[3rem] backdrop-blur-xl"
        >
          <div className="w-24 h-24 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="text-brand w-12 h-12" />
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">Inquiry Received</h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto mb-12">
            Thank you for choosing Green Hopper Events. Our luxury event consultants are reviewing your details and will reach out shortly to begin crafting your unforgettable celebration.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-12 py-4 bg-brand text-black font-bold rounded-full hover:scale-105 transition-transform"
          >
            Return to Homepage
          </button>
        </motion.div>
      </div>
    );
  }

  const FormSection = ({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) => (
    <div className="space-y-8 py-10 border-b border-white/5 last:border-0">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-brand/10 rounded-2xl flex items-center justify-center text-brand">
          <Icon size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
          <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mt-1">Please provide accurate details</p>
        </div>
      </div>
      {children}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 relative">
      {/* Header */}
      <div className="text-center mb-16">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-brand text-xs font-black uppercase tracking-[0.4em] mb-4 block"
        >
          Event Consultation
        </motion.span>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-display font-bold text-white tracking-tighter mb-6"
        >
          Begin Your <span className="text-brand-gradient italic">Story</span>
        </motion.h1>
      </div>

      <div className="bg-zinc-900/30 border border-white/5 p-8 md:p-16 rounded-[3rem] backdrop-blur-xl relative overflow-hidden">
        <form onSubmit={handleSubmit(onSubmit as any)} className="divide-y divide-white/5">
          {/* SECTION: COUPLE INFO */}
          <FormSection title="Couple Details" icon={Heart}>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-white/40 text-[10px] font-black uppercase tracking-widest px-1">Groom's Name</label>
                <div className="relative">
                  <Heart size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" />
                  <input 
                    {...register('groomName')}
                    placeholder="Full Name"
                    className={cn(
                      "w-full bg-white/5 border rounded-2xl pl-14 pr-6 py-4 text-white focus:bg-white/[0.08] transition-all outline-none",
                      errors.groomName 
                        ? "border-rose-500/50 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10" 
                        : "border-white/10 focus:border-brand/50 focus:ring-4 focus:ring-brand/5"
                    )}
                  />
                </div>
                {errors.groomName && <p className="text-rose-500 text-xs px-1 mt-1 font-bold">{errors.groomName.message}</p>}
              </div>
              <div className="space-y-3">
                <label className="text-white/40 text-[10px] font-black uppercase tracking-widest px-1">Bride's Name</label>
                <div className="relative">
                  <Heart size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" />
                  <input 
                    {...register('brideName')}
                    placeholder="Full Name"
                    className={cn(
                      "w-full bg-white/5 border rounded-2xl pl-14 pr-6 py-4 text-white focus:bg-white/[0.08] transition-all outline-none",
                      errors.brideName 
                        ? "border-rose-500/50 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10" 
                        : "border-white/10 focus:border-brand/50 focus:ring-4 focus:ring-brand/5"
                    )}
                  />
                </div>
                {errors.brideName && <p className="text-rose-500 text-xs px-1 mt-1 font-bold">{errors.brideName.message}</p>}
              </div>
            </div>
          </FormSection>

          {/* SECTION: EVENT INFO */}
          <FormSection title="Event Logistics" icon={Calendar}>
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-white/40 text-[10px] font-black uppercase tracking-widest px-1">Function Date</label>
                  <input 
                    {...register('preferredFunctionDate')}
                    type="date"
                    className={cn(
                      "w-full bg-white/5 border rounded-2xl px-6 py-4 text-white focus:bg-white/[0.08] transition-all [color-scheme:dark] outline-none",
                      errors.preferredFunctionDate 
                        ? "border-rose-500/50 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10" 
                        : "border-white/10 focus:border-brand/50 focus:ring-4 focus:ring-brand/5"
                    )}
                  />
                  {errors.preferredFunctionDate && <p className="text-rose-500 text-xs px-1 mt-1 font-bold">{errors.preferredFunctionDate.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="text-white/40 text-[10px] font-black uppercase tracking-widest px-1">Start Time</label>
                    <input 
                      {...register('functionStartTime')}
                      type="time"
                      className={cn(
                        "w-full bg-white/5 border rounded-2xl px-4 py-4 text-white transition-all [color-scheme:dark] outline-none",
                        errors.functionStartTime 
                          ? "border-rose-500/50 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10" 
                          : "border-white/10 focus:border-brand focus:ring-4 focus:ring-brand/5"
                      )}
                    />
                    {errors.functionStartTime && <p className="text-rose-500 text-xs px-1 mt-1 font-bold">{errors.functionStartTime.message}</p>}
                  </div>
                  <div className="space-y-3">
                    <label className="text-white/40 text-[10px] font-black uppercase tracking-widest px-1">End Time</label>
                    <input 
                      {...register('functionEndTime')}
                      type="time"
                      className={cn(
                        "w-full bg-white/5 border rounded-2xl px-4 py-4 text-white transition-all [color-scheme:dark] outline-none",
                        errors.functionEndTime 
                          ? "border-rose-500/50 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10" 
                          : "border-white/10 focus:border-brand focus:ring-4 focus:ring-brand/5"
                      )}
                    />
                    {errors.functionEndTime && <p className="text-rose-500 text-xs px-1 mt-1 font-bold">{errors.functionEndTime.message}</p>}
                  </div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-white/40 text-[10px] font-black uppercase tracking-widest px-1">Function Location</label>
                  <div className="relative">
                    <MapPin size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" />
                    <input 
                      {...register('functionLocation')}
                      placeholder="City, State"
                      className={cn(
                        "w-full bg-white/5 border rounded-2xl pl-14 pr-6 py-4 text-white transition-all outline-none",
                        errors.functionLocation 
                          ? "border-rose-500/50 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10" 
                          : "border-white/10 focus:border-brand focus:ring-4 focus:ring-brand/5"
                      )}
                    />
                  </div>
                  {errors.functionLocation && <p className="text-rose-500 text-xs px-1 mt-1 font-bold">{errors.functionLocation.message}</p>}
                </div>
                <div className="space-y-3">
                  <label className="text-white/40 text-[10px] font-black uppercase tracking-widest px-1">Specific Venue</label>
                  <input 
                    {...register('venue')}
                    placeholder="Hotel Name / Convention Center"
                    className={cn(
                      "w-full bg-white/5 border rounded-2xl px-6 py-4 text-white transition-all outline-none",
                      errors.venue 
                        ? "border-rose-500/50 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10" 
                        : "border-white/10 focus:border-brand focus:ring-4 focus:ring-brand/5"
                    )}
                  />
                  {errors.venue && <p className="text-rose-500 text-xs px-1 mt-1 font-bold">{errors.venue.message}</p>}
                </div>
              </div>
            </div>
          </FormSection>

          {/* SECTION: TRADITION & STYLE */}
          <FormSection title="Wedding Style" icon={Sparkles}>
            <div className="space-y-10">
              <div className="space-y-4">
                <label className="text-white/40 text-[10px] font-black uppercase tracking-widest px-1">Wedding Tradition</label>
                <div className={cn(
                  "grid grid-cols-2 md:grid-cols-4 gap-4 p-1 rounded-3xl transition-all",
                  errors.weddingTradition && "border border-rose-500/20 bg-rose-500/5 p-4"
                )}>
                  {['Muslim Wedding', 'Hindu Wedding', 'Christian Wedding', 'Other Tradition'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setValue('weddingTradition', t as any, { shouldValidate: true });
                      }}
                      className={cn(
                        "px-4 py-4 rounded-2xl border text-[10px] font-bold transition-all cursor-pointer",
                        weddingTradition === t ? "bg-brand border-brand text-black shadow-lg shadow-brand/20" : "bg-white/5 border-white/5 text-white/40 hover:border-white/20"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                {errors.weddingTradition && <p className="text-rose-500 text-xs px-1 mt-1 font-bold">{errors.weddingTradition.message}</p>}
              </div>
              
              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <label className="text-white/40 text-[10px] font-black uppercase tracking-widest px-1">Function Type</label>
                  <div className={cn(
                    "flex flex-wrap gap-3 p-1 rounded-3xl transition-all",
                    errors.functionType && "border border-rose-500/20 bg-rose-500/5 p-4"
                  )}>
                    {['Nikkah', 'Wedding', 'Reception'].map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setValue('functionType', f as any, { shouldValidate: true })}
                        className={cn(
                          "px-6 py-3 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer",
                          functionType === f ? "bg-brand border-brand text-black" : "bg-white/5 border-white/5 text-white/40"
                        )}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                  {errors.functionType && <p className="text-rose-500 text-xs px-1 mt-1 font-bold">{errors.functionType.message}</p>}
                </div>
                <div className="space-y-4">
                  <label className="text-white/40 text-[10px] font-black uppercase tracking-widest px-1">Schedule Preference</label>
                  <div className={cn(
                    "flex gap-4 p-1 rounded-2xl transition-all",
                    errors.programSchedule && "border border-rose-500/20 bg-rose-500/5 p-4"
                  )}>
                    {['Day', 'Night'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setValue('programSchedule', s as any, { shouldValidate: true })}
                        className={cn(
                          "flex-1 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer",
                          programSchedule === s ? "bg-white text-black border-white" : "bg-white/5 border-white/5 text-white/40"
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  {errors.programSchedule && <p className="text-rose-500 text-xs px-1 mt-1 font-bold">{errors.programSchedule.message}</p>}
                </div>
              </div>
            </div>
          </FormSection>

          {/* SECTION: ADDITIONAL FUNCTIONS */}
          <FormSection title="Additional Celebrations" icon={PartyPopper}>
            <div className="space-y-10">
              <div className="space-y-6">
                <label className="text-white/40 text-[10px] font-black uppercase tracking-widest px-1">Selected Celebrations</label>
                <div className="flex flex-wrap gap-2">
                  {ADDON_FUNCTIONS.map((addon) => (
                    <button
                      key={addon}
                      type="button"
                      onClick={() => toggleAddon(addon)}
                      className={cn(
                        "px-5 py-2.5 rounded-full border text-[10px] font-bold transition-all",
                        selectedAddons?.includes(addon) ? "bg-brand/10 border-brand text-brand" : "bg-white/5 border-white/5 text-white/40 hover:border-white/10"
                      )}
                    >
                      {addon}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <label className="text-white/40 text-[10px] font-black uppercase tracking-widest px-1">Total Function Days</label>
                  <div className={cn(
                    "flex gap-3 p-1 rounded-2xl transition-all",
                    errors.functionDays && "border border-rose-500/20 bg-rose-500/5 p-4"
                  )}>
                    {['1', '2', '3', 'Other'].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setValue('functionDays', d as any, { shouldValidate: true })}
                        className={cn(
                          "w-12 h-12 rounded-xl border flex items-center justify-center font-bold transition-all cursor-pointer",
                          functionDays === d ? "bg-white text-black border-white shadow-xl" : "bg-white/5 border-white/5 text-white/40"
                        )}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                  {errors.functionDays && <p className="text-rose-500 text-xs px-1 mt-1 font-bold">{errors.functionDays.message}</p>}
                </div>
                <div className="space-y-4">
                  <label className="text-white/40 text-[10px] font-black uppercase tracking-widest px-1">Atmosphere</label>
                  <div className={cn(
                    "flex gap-4 p-1 rounded-2xl transition-all",
                    errors.functionPlannedAt && "border border-rose-500/20 bg-rose-500/5 p-4"
                  )}>
                    {['Outdoor', 'Indoor'].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setValue('functionPlannedAt', p as any, { shouldValidate: true })}
                        className={cn(
                          "flex-1 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer",
                          functionPlannedAt === p ? "bg-white/10 border-brand text-brand" : "bg-white/5 border-white/5 text-white/40"
                        )}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  {errors.functionPlannedAt && <p className="text-rose-500 text-xs px-1 mt-1 font-bold">{errors.functionPlannedAt.message}</p>}
                </div>
              </div>
            </div>
          </FormSection>

          {/* SECTION: GUESTS & BUDGET */}
          <FormSection title="Guest & Budget" icon={Users}>
            <div className="space-y-10">
              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <label className="text-white/40 text-[10px] font-black uppercase tracking-widest px-1">Expected Guests</label>
                    <span className="text-brand font-black">{watch('expectedGuests')}</span>
                  </div>
                  <input 
                    type="range"
                    min="50"
                    max="5000"
                    step="50"
                    {...register('expectedGuests', { valueAsNumber: true })}
                    className="w-full accent-brand bg-white/10 h-1.5 rounded-full appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-white/20 font-bold">
                    <span>50</span>
                    <span>5000+</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-white/40 text-[10px] font-black uppercase tracking-widest px-1">Estimated Budget (INR)</label>
                  <div className="relative">
                    <IndianRupee size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-brand" />
                    <input 
                      type="number"
                      {...register('estimatedBudget', { valueAsNumber: true })}
                      placeholder="Amount in INR"
                      className={cn(
                        "w-full bg-white/5 border rounded-2xl pl-14 pr-6 py-4 text-white font-bold transition-all outline-none",
                        errors.estimatedBudget 
                          ? "border-rose-500/50 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10" 
                          : "border-white/10 focus:border-brand focus:ring-4 focus:ring-brand/5"
                      )}
                    />
                  </div>
                  {errors.estimatedBudget && <p className="text-rose-500 text-xs px-1 mt-1 font-bold">{errors.estimatedBudget.message}</p>}
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-white/40 text-[10px] font-black uppercase tracking-widest px-1">Special Rituals or Suggestions</label>
                <textarea 
                  {...register('specialSuggestions')}
                  rows={4}
                  placeholder="Share your vision or any specific traditions you want us to highlight..."
                  className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-4 text-white focus:border-brand/50 transition-all resize-none"
                />
              </div>
            </div>
          </FormSection>

          {/* SECTION: COMMUNICATION */}
          <FormSection title="Contact Information" icon={Phone}>
            <div className="space-y-10">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-white/40 text-[10px] font-black uppercase tracking-widest px-1">Contact Number</label>
                  <input 
                    {...register('contactNumber')}
                    placeholder="+91 XXX XXX XXXX"
                    className={cn(
                      "w-full bg-white/5 border rounded-2xl px-6 py-4 text-white transition-all outline-none",
                      errors.contactNumber 
                        ? "border-rose-500/50 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10" 
                        : "border-white/10 focus:border-brand focus:ring-4 focus:ring-brand/5"
                    )}
                  />
                  {errors.contactNumber && <p className="text-rose-500 text-xs px-1 mt-1 font-bold">{errors.contactNumber.message}</p>}
                </div>
                <div className="space-y-3">
                  <label className="text-white/40 text-[10px] font-black uppercase tracking-widest px-1">WhatsApp Number</label>
                  <input 
                    {...register('whatsappNumber')}
                    placeholder="+91 XXX XXX XXXX"
                    className={cn(
                      "w-full bg-white/5 border rounded-2xl px-6 py-4 text-white transition-all outline-none",
                      errors.whatsappNumber 
                        ? "border-rose-500/50 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10" 
                        : "border-white/10 focus:border-brand focus:ring-4 focus:ring-brand/5"
                    )}
                  />
                  {errors.whatsappNumber && <p className="text-rose-500 text-xs px-1 mt-1 font-bold">{errors.whatsappNumber.message}</p>}
                </div>
              </div>

              <div className="space-y-6">
                <label className="text-white/40 text-[10px] font-black uppercase tracking-widest px-1">Preferred Consultation Method</label>
                <div className={cn(
                  "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 p-1 rounded-2xl transition-all",
                  errors.preferredCommunicationMethod && "border border-rose-500/20 bg-rose-500/5 p-4"
                )}>
                  {['Phone Call', 'WhatsApp', 'Email', 'Botim', 'Google Meet', 'Zoom'].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setValue('preferredCommunicationMethod', m as any, { shouldValidate: true })}
                      className={cn(
                        "py-4 rounded-2xl border text-[10px] font-black uppercase tracking-tighter transition-all cursor-pointer",
                        preferredComm === m ? "bg-brand border-brand text-black shadow-lg shadow-brand/20" : "bg-white/5 border-white/5 text-white/40 hover:border-white/20"
                      )}
                    >
                      {m}
                    </button>
                  ))}
                </div>
                {errors.preferredCommunicationMethod && <p className="text-rose-500 text-xs px-1 mt-1 font-bold">{errors.preferredCommunicationMethod.message}</p>}
              </div>
            </div>
          </FormSection>

          {/* SUBMIT BUTTON */}
          <div className="pt-16 text-center">
            <div className="inline-flex items-center gap-3 bg-brand/5 border border-brand/20 px-6 py-4 rounded-[2rem] mb-8">
              <Info size={16} className="text-brand" />
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Our experts will contact you within 24 hours</p>
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="w-full md:w-auto px-20 py-5 bg-brand text-black font-black uppercase tracking-[0.2em] text-xs rounded-full flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] disabled:opacity-50"
            >
              {isPending ? <Loader2 size={20} className="animate-spin" /> : <>Send Inquiry <ChevronRight size={18} /></>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
