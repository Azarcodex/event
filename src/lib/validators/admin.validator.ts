import { z } from 'zod';

export const createAdminSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  permissions: z.array(z.enum(['media_management', 'bookings_management'])).default([]),
});

export type CreateAdminInput = z.infer<typeof createAdminSchema>;

export const updateAdminSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
  permissions: z.array(z.enum(['media_management', 'bookings_management'])).default([]),
  status: z.enum(['active', 'inactive']).default('active'),
});

export type UpdateAdminInput = z.infer<typeof updateAdminSchema>;
