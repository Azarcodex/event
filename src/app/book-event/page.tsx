import BookingFormClient from '@/components/booking/BookingFormClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book Your Unforgettable Event',
  description: 'Schedule a luxury wedding or event consultation with Kerala\'s premium event management company.',
  openGraph: {
    title: 'Book Your Unforgettable Event | Green Hopper Events',
    description: 'Schedule a luxury wedding or event consultation with Kerala\'s premium event management company.',
    images: [
      {
        url: '/images/og-booking.jpg',
        width: 1200,
        height: 630,
        alt: 'Book Your Event with Green Hopper Events',
      },
    ],
  },
};

export default function BookEventPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-brand/30">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-brand/5 blur-[100px] rounded-full animate-pulse delay-700" />
      </div>

      <BookingFormClient />
    </main>
  );
}
