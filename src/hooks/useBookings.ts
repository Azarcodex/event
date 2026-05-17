import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingApi } from '@/services/bookingApi';
import { BookingInput } from '@/lib/validators/booking.validator';
import { toast } from 'sonner';

export const useCreateBooking = () => {
  return useMutation({
    mutationFn: (data: BookingInput) => bookingApi.submitBooking(data),
    onSuccess: () => {
      toast.success('Inquiry submitted successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to submit inquiry';
      toast.error(message);
    },
  });
};

export const useAdminBookings = (page: number, limit: number, search: string, status: string = '') => {
  return useQuery({
    queryKey: ['bookings', page, limit, search, status],
    queryFn: () => bookingApi.getAllBookings(page, limit, search, status),
  });
};

export const useBookingDetails = (id: string) => {
  return useQuery({
    queryKey: ['bookings', id],
    queryFn: () => bookingApi.getBookingById(id),
    enabled: !!id,
  });
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'Pending' | 'Completed' }) =>
      bookingApi.updateBookingStatus(id, status),
    onSuccess: () => {
      toast.success('Booking status updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update booking status');
    },
  });
};

export const useDeleteBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bookingApi.deleteBooking(id),
    onSuccess: () => {
      toast.success('Booking deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete booking');
    },
  });
};
