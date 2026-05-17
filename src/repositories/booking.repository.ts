import Booking, { IBookingDocument } from '@/models/Booking';

export class BookingRepository {
  async create(data: any) {
    const newBooking = new Booking(data);
    return await newBooking.save();
  }

  async findAll(page: number = 1, limit: number = 10, search?: string, status?: string) {
    const skip = (page - 1) * limit;
    
    let query: any = {};
    if (search) {
      query.$or = [
        { groomName: { $regex: search, $options: 'i' } },
        { brideName: { $regex: search, $options: 'i' } },
        { contactNumber: { $regex: search, $options: 'i' } },
        { functionLocation: { $regex: search, $options: 'i' } },
      ];
    }

    if (status && status !== 'All') {
      if (status === 'Completed') {
        query.status = 'Completed';
      } else if (status === 'Not Completed') {
        query.status = { $ne: 'Completed' };
      }
    }

    const [bookings, total] = await Promise.all([
      Booking.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      Booking.countDocuments(query),
    ]);

    return {
      bookings,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    };
  }

  async findById(id: string) {
    return await Booking.findById(id).exec();
  }

  async updateById(id: string, updateData: any) {
    return await Booking.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async deleteById(id: string) {
    return await Booking.findByIdAndDelete(id).exec();
  }
}

export const bookingRepository = new BookingRepository();
