import { eventRepository } from '@/repositories/event.repository';
import { CreateEventInput } from '@/lib/validators/media.validator';

export class EventService {
  async getAll() {
    return eventRepository.findAll();
  }

  async getById(id: string) {
    const event = await eventRepository.findById(id);
    if (!event) throw new Error('Event not found');
    return event;
  }

  async create(data: CreateEventInput) {
    return eventRepository.create(data);
  }

  async update(id: string, data: Partial<CreateEventInput>) {
    const event = await eventRepository.update(id, data);
    if (!event) throw new Error('Event not found');
    return event;
  }

  async delete(id: string) {
    const deleted = await eventRepository.delete(id);
    if (!deleted) throw new Error('Event not found');
  }
}

export const eventService = new EventService();
