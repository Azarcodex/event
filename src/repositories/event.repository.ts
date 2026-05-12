import Event, { IEventDocument } from '@/models/Event';
import { CreateEventInput } from '@/lib/validators/media.validator';
import { Types } from 'mongoose';

export class EventRepository {
  async findAll(): Promise<IEventDocument[]> {
    return Event.find().sort({ createdAt: -1 }).lean<IEventDocument[]>().exec();
  }

  async findById(id: string): Promise<IEventDocument | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return Event.findById(id).lean<IEventDocument>().exec();
  }

  async create(data: CreateEventInput): Promise<IEventDocument> {
    const event = new Event(data);
    return event.save();
  }

  async update(id: string, data: Partial<CreateEventInput>): Promise<IEventDocument | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return Event.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .lean<IEventDocument>()
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) return false;
    const result = await Event.findByIdAndDelete(id).exec();
    return result !== null;
  }
}

export const eventRepository = new EventRepository();
