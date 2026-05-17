import BookingsManagementClient from '@/components/admin/bookings/BookingsManagementClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Event Bookings Management | Admin Dashboard',
  description: 'Manage and review wedding and event booking inquiries.',
};

export default function AdminBookingsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Event Bookings</h2>
          <p className="text-zinc-500 mt-1 text-sm sm:text-base">Review and manage premium event inquiries.</p>
        </div>
      </div>
      
      <BookingsManagementClient />
    </div>
  );
}
