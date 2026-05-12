import { z } from 'zod';

// ─── Allowed types ────────────────────────────────────────────────────────────

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'] as const;
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm'] as const;
export const ALLOWED_MIME_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES] as const;

export const IMAGE_MAX_SIZE = 10 * 1024 * 1024; // 10 MB
export const VIDEO_MAX_SIZE = 100 * 1024 * 1024; // 100 MB

export type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number];

// ─── Zod schemas ──────────────────────────────────────────────────────────────

export const mediaQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  type: z.enum(['IMAGE', 'VIDEO', 'ALL']).default('ALL'),
});

export type MediaQueryInput = z.infer<typeof mediaQuerySchema>;

export const createEventSchema = z.object({
  name: z.string().min(1, 'Event name is required').max(200),
  description: z.string().max(2000).optional(),
  date: z.string().optional(),
  location: z.string().max(500).optional(),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;

// ─── File validation (server-side) ───────────────────────────────────────────

export function validateFile(
  mimeType: string,
  size: number
): { valid: true; isVideo: boolean } | { valid: false; error: string } {
  if (!ALLOWED_MIME_TYPES.includes(mimeType as AllowedMimeType)) {
    return {
      valid: false,
      error: `Unsupported file type: ${mimeType}. Allowed: jpg, jpeg, png, webp, mp4, webm`,
    };
  }

  const isVideo = ALLOWED_VIDEO_TYPES.includes(mimeType as (typeof ALLOWED_VIDEO_TYPES)[number]);
  const maxSize = isVideo ? VIDEO_MAX_SIZE : IMAGE_MAX_SIZE;

  if (size > maxSize) {
    const maxMB = maxSize / (1024 * 1024);
    return {
      valid: false,
      error: `File too large. Maximum size for ${isVideo ? 'videos' : 'images'} is ${maxMB}MB`,
    };
  }

  return { valid: true, isVideo };
}
