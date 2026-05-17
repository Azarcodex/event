import { z } from 'zod';

export const bookingSchema = z.object({
  groomName: z.string().min(2, 'Groom name must be at least 2 characters'),
  brideName: z.string().min(2, 'Bride name must be at least 2 characters'),
  contactNumber: z.string().min(10, 'Invalid contact number'),
  whatsappNumber: z.string().min(10, 'Invalid WhatsApp number'),
  preferredFunctionDate: z.string().min(1, 'Please select a function date'),
  functionStartTime: z.string().min(1, 'Start time is required'),
  functionEndTime: z.string().min(1, 'End time is required'),
  functionLocation: z.string().min(2, 'Location is required'),
  venue: z.string().min(2, 'Venue is required'),
  weddingTradition: z.enum(['Muslim Wedding', 'Hindu Wedding', 'Christian Wedding', 'Other Tradition']),
  programSchedule: z.enum(['Day', 'Night']),
  functionType: z.enum(['Nikkah', 'Wedding', 'Reception']),
  additionalFunctions: z.array(z.string()).default([]),
  functionDays: z.enum(['1', '2', '3', 'Other']),
  functionPlannedAt: z.enum(['Outdoor', 'Indoor']),
  ritualsOrTraditions: z.string().optional(),
  specialSuggestions: z.string().optional(),
  expectedGuests: z.number().min(1, 'Guest count must be at least 1'),
  estimatedBudget: z.number().min(1, 'Budget must be at least 1'),
  preferredCommunicationMethod: z.enum(['Phone Call', 'WhatsApp', 'Email', 'Botim', 'Google Meet', 'Zoom']),
});

export type BookingInput = z.infer<typeof bookingSchema>;
