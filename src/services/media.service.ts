import { mediaRepository, CreateMediaData, MediaQuery } from '@/repositories/media.repository';
import { uploadToCloudinary, deleteFromCloudinary, getVideoThumbnailUrl } from '@/lib/cloudinary';
import { validateFile } from '@/lib/validators/media.validator';

export class MediaService {
  async upload(fileBuffer: Buffer, mimeType: string, eventId?: string) {
    // Server-side validation
    const validation = validateFile(mimeType, fileBuffer.length);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const { isVideo } = validation;
    const resourceType = isVideo ? 'video' : 'image';

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(fileBuffer, eventId || 'general', resourceType);

    // Generate thumbnail for videos if not provided by eager transform
    let thumbnailUrl = uploadResult.thumbnail_url;
    if (isVideo && !thumbnailUrl) {
      thumbnailUrl = getVideoThumbnailUrl(uploadResult.public_id);
    }

    // Persist to database
    const createData: CreateMediaData = {
      eventId,
      publicId: uploadResult.public_id,
      secureUrl: uploadResult.secure_url,
      mediaType: isVideo ? 'VIDEO' : 'IMAGE',
      format: uploadResult.format,
      size: uploadResult.bytes,
      width: uploadResult.width,
      height: uploadResult.height,
      duration: uploadResult.duration,
      thumbnailUrl,
    };

    return mediaRepository.create(createData);
  }

  async getEventMedia(eventId: string, query: MediaQuery) {
    return mediaRepository.findByEventId(eventId, query);
  }

  async getAllMedia(query: MediaQuery) {
    return mediaRepository.findAll(query);
  }

  async delete(mediaId: string) {
    const media = await mediaRepository.findById(mediaId);
    if (!media) throw new Error('Media not found');

    const resourceType = media.mediaType === 'VIDEO' ? 'video' : 'image';

    // Delete from Cloudinary first
    await deleteFromCloudinary(media.publicId, resourceType);

    // Then remove from database
    await mediaRepository.delete(mediaId);

    return media;
  }
}

export const mediaService = new MediaService();
