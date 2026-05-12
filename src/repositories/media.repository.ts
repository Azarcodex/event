import Media, { IMediaDocument } from '@/models/Media';
import { Types } from 'mongoose';

export interface CreateMediaData {
  eventId?: string;
  publicId: string;
  secureUrl: string;
  mediaType: 'IMAGE' | 'VIDEO';
  format: string;
  size: number;
  width?: number;
  height?: number;
  duration?: number;
  thumbnailUrl?: string;
}

export interface MediaQuery {
  page: number;
  limit: number;
  type: 'IMAGE' | 'VIDEO' | 'ALL';
  isHero?: boolean;
}

export interface PaginatedMediaResult {
  media: IMediaDocument[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

export class MediaRepository {
  async create(data: CreateMediaData): Promise<IMediaDocument> {
    const media = new Media({
      ...data,
      eventId: data.eventId ? new Types.ObjectId(data.eventId) : undefined,
    });
    return media.save();
  }

  async findAll(query: MediaQuery): Promise<PaginatedMediaResult> {
    const filter: Record<string, unknown> = {};
    if (query.type !== 'ALL') {
      filter.mediaType = query.type;
    }
    if (query.isHero !== undefined) {
      filter.isHeroBanner = query.isHero;
    }

    const skip = (query.page - 1) * query.limit;

    const [media, total] = await Promise.all([
      Media.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(query.limit)
        .lean<IMediaDocument[]>()
        .exec(),
      Media.countDocuments(filter).exec(),
    ]);

    const totalPages = Math.ceil(total / query.limit);

    return {
      media,
      total,
      page: query.page,
      totalPages,
      hasMore: query.page < totalPages,
    };
  }

  async findByEventId(eventId: string, query: MediaQuery): Promise<PaginatedMediaResult> {
    if (!Types.ObjectId.isValid(eventId)) {
      return { media: [], total: 0, page: 1, totalPages: 0, hasMore: false };
    }

    const filter: Record<string, unknown> = { eventId: new Types.ObjectId(eventId) };
    if (query.type !== 'ALL') {
      filter.mediaType = query.type;
    }

    const skip = (query.page - 1) * query.limit;

    const [media, total] = await Promise.all([
      Media.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(query.limit)
        .lean<IMediaDocument[]>()
        .exec(),
      Media.countDocuments(filter).exec(),
    ]);

    const totalPages = Math.ceil(total / query.limit);

    return {
      media,
      total,
      page: query.page,
      totalPages,
      hasMore: query.page < totalPages,
    };
  }

  async findById(id: string): Promise<IMediaDocument | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return Media.findById(id).lean<IMediaDocument>().exec();
  }

  async delete(id: string): Promise<IMediaDocument | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return Media.findByIdAndDelete(id).lean<IMediaDocument>().exec();
  }

  async deleteByEventId(eventId: string): Promise<void> {
    if (!Types.ObjectId.isValid(eventId)) return;
    await Media.deleteMany({ eventId: new Types.ObjectId(eventId) }).exec();
  }

  async toggleHero(id: string, status: boolean): Promise<IMediaDocument | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return Media.findByIdAndUpdate(
      id,
      { isHeroBanner: status },
      { returnDocument: 'after' }
    ).lean<IMediaDocument>().exec();
  }
}

export const mediaRepository = new MediaRepository();
