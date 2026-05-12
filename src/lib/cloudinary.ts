import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure: true,
});

export { cloudinary };

// ─── Upload ──────────────────────────────────────────────────────────────────

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  resource_type: 'image' | 'video';
  format: string;
  bytes: number;
  width?: number;
  height?: number;
  duration?: number;
  thumbnail_url?: string;
}

export async function uploadToCloudinary(
  fileBuffer: Buffer,
  eventId: string,
  resourceType: 'image' | 'video'
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const uploadOptions: Record<string, unknown> = {
      folder: `events/${eventId}/media`,
      resource_type: resourceType,
      // Auto-generate thumbnail for videos
      ...(resourceType === 'video' && {
        eager: [{ format: 'jpg', transformation: [{ width: 600, height: 400, crop: 'fill' }] }],
        eager_async: false,
      }),
    };

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          reject(new Error(error.message));
          return;
        }
        if (!result) {
          reject(new Error('Upload returned no result'));
          return;
        }

        const thumbnailUrl =
          resourceType === 'video' && result.eager?.[0]?.secure_url
            ? result.eager[0].secure_url
            : undefined;

        resolve({
          public_id: result.public_id,
          secure_url: result.secure_url,
          resource_type: result.resource_type as 'image' | 'video',
          format: result.format,
          bytes: result.bytes,
          width: result.width,
          height: result.height,
          duration: result.duration,
          thumbnail_url: thumbnailUrl,
        });
      }
    );

    uploadStream.end(fileBuffer);
  });
}

// ─── Delete ──────────────────────────────────────────────────────────────────

export async function deleteFromCloudinary(
  publicId: string,
  resourceType: 'image' | 'video'
): Promise<void> {
  const result = await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
  });

  if (result.result !== 'ok' && result.result !== 'not found') {
    throw new Error(`Failed to delete from Cloudinary: ${result.result}`);
  }
}

// ─── Optimized URL helpers ────────────────────────────────────────────────────

export function getOptimizedImageUrl(publicId: string, width = 800): string {
  return cloudinary.url(publicId, {
    width,
    crop: 'limit',
    fetch_format: 'auto',
    quality: 'auto',
    secure: true,
  });
}

export function getVideoThumbnailUrl(publicId: string): string {
  return cloudinary.url(publicId, {
    resource_type: 'video',
    format: 'jpg',
    transformation: [{ width: 600, height: 400, crop: 'fill' }],
    secure: true,
  });
}
