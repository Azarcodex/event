import { z } from 'zod';

export const reviewSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  description: z.string().min(10, 'Review must be at least 10 characters').max(1000),
  rating: z.number().min(1).max(5),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
