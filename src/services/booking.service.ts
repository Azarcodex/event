import { bookingRepository } from '@/repositories/booking.repository';
import { bookingSchema } from '@/lib/validators/booking.validator';

export class BookingService {
  async createBooking(data: any) {
    const validatedData = bookingSchema.parse(data);
    return await bookingRepository.create(validatedData);
  }

  async getAllBookings(page?: number, limit?: number, search?: string, status?: string) {
    return await bookingRepository.findAll(page, limit, search, status);
  }

  async getBookingById(id: string) {
    const booking = await bookingRepository.findById(id);
    if (!booking) {
      throw new Error('Booking not found');
    }
    return booking;
  }

  async updateBooking(id: string, data: any) {
    const booking = await bookingRepository.findById(id);
    if (!booking) {
      throw new Error('Booking not found');
    }
    return await bookingRepository.updateById(id, data);
  }

  async deleteBooking(id: string) {
    return await bookingRepository.deleteById(id);
  }
}

export const bookingService = new BookingService();
