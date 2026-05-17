import BookingDetailsPageClient from '@/components/admin/bookings/BookingDetailsPageClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Booking Inquiry Details | Admin Dashboard',
};

export default function AdminBookingDetailsPage() {
  return <BookingDetailsPageClient />;
}
