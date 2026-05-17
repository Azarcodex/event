import axios from 'axios';
import { BookingInput, IBooking } from '@/types/booking';

const api = axios.create({
  baseURL: '/api',
});

export const bookingApi = {
  // Public
  submitBooking: async (data: BookingInput) => {
    const response = await api.post('/bookings', data);
    return response.data;
  },

  // Admin
  getAllBookings: async (page: number = 1, limit: number = 10, search: string = '', status: string = '') => {
    const response = await api.get(`/admin/bookings?page=${page}&limit=${limit}&search=${search}&status=${status}`);
    return response.data;
  },

  getBookingById: async (id: string) => {
    const response = await api.get(`/admin/bookings/${id}`);
    return response.data;
  },

  updateBookingStatus: async (id: string, status: 'Pending' | 'Completed') => {
    const response = await api.patch(`/admin/bookings/${id}`, { status });
    return response.data;
  },

  deleteBooking: async (id: string) => {
    const response = await api.delete(`/admin/bookings/${id}`);
    return response.data;
  },
};
