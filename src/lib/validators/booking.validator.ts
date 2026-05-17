import { z } from 'zod';

export const bookingSchema = z.object({
  groomName: z.string().min(1, "Please enter Groom's full name"),
  brideName: z.string().min(1, "Please enter Bride's full name"),
  contactNumber: z.string()
    .min(1, "Please enter your phone number")
    .regex(/^\+?[0-9\s-]{10,15}$/, "Please enter a valid phone number"),
  whatsappNumber: z.string()
    .min(1, "Please enter your WhatsApp number")
    .regex(/^\+?[0-9\s-]{10,15}$/, "Please enter a valid WhatsApp number"),
  preferredFunctionDate: z.string().min(1, "Preferred function date is required"),
  functionStartTime: z.string().min(1, "Start time is required"),
  functionEndTime: z.string().min(1, "End time is required"),
  functionLocation: z.string().min(1, "Please select a location"),
  venue: z.string().min(1, "Please select a venue"),
  weddingTradition: z.enum(['Muslim Wedding', 'Hindu Wedding', 'Christian Wedding', 'Other Tradition'], {
    message: 'Please select a wedding tradition',
  }),
  programSchedule: z.enum(['Day', 'Night'], {
    message: 'Please select a schedule preference',
  }),
  functionType: z.enum(['Nikkah', 'Wedding', 'Reception'], {
    message: 'Please select a function type',
  }),
  additionalFunctions: z.array(z.string()).default([]),
  functionDays: z.enum(['1', '2', '3', 'Other'], {
    message: 'Please select total function days',
  }),
  functionPlannedAt: z.enum(['Outdoor', 'Indoor'], {
    message: 'Please select an atmosphere',
  }),
  ritualsOrTraditions: z.string().optional(),
  specialSuggestions: z.string().optional(),
  expectedGuests: z.number().min(1, 'Guest count must be at least 1'),
  estimatedBudget: z.number().min(1, 'Budget must be at least 1'),
  preferredCommunicationMethod: z.enum(['Phone Call', 'WhatsApp', 'Email', 'Botim', 'Google Meet', 'Zoom'], {
    message: 'Please select a preferred consultation method',
  }),
});

export type BookingInput = z.infer<typeof bookingSchema>;
