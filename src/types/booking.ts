export const BOOKING_STATUSES = [
  'Event Confirm',
  'Full Advance',
  'Advance',
  'Verbal Commitment',
  'Followup',
  'Not Interested',
  'Bad Fit for us',
  'Meeting Recheduled',
  'Cancelled',
  '1 st meeting done',
  'Not responding',
  'Contact Watsapp',
  '2 nd meeting done',
  'Contacted'
] as const;

export type BookingStatus = typeof BOOKING_STATUSES[number];

export const BOOKING_SERVICES = [
  'Estimate',
  'Check List',
  'Quatation',
  'Food Menu',
  'Invoice',
  'Presentation',
  'Mood Board',
  'Nothing',
  'Stage Design',
  'Presentation & Quat'
] as const;

export type BookingService = typeof BOOKING_SERVICES[number];

export interface IBooking {
  _id: string;
  groomName: string;
  brideName: string;
  contactNumber: string;
  whatsappNumber: string;
  preferredFunctionDate: string;
  functionStartTime: string;
  functionEndTime: string;
  functionLocation: string;
  venue: string;
  weddingTradition: 'Muslim Wedding' | 'Hindu Wedding' | 'Christian Wedding' | 'Other Tradition';
  programSchedule: 'Day' | 'Night';
  functionType: 'Nikkah' | 'Wedding' | 'Reception';
  additionalFunctions: string[];
  functionDays: '1' | '2' | '3' | 'Other';
  functionPlannedAt: 'Outdoor' | 'Indoor';
  ritualsOrTraditions?: string;
  specialSuggestions?: string;
  expectedGuests: number;
  estimatedBudget: number;
  preferredCommunicationMethod: 'Phone Call' | 'WhatsApp' | 'Email' | 'Botim' | 'Google Meet' | 'Zoom';
  status: BookingStatus;
  services: string[];
  createdAt: string;
  updatedAt: string;
}

export type BookingInput = Omit<IBooking, '_id' | 'createdAt' | 'updatedAt' | 'status' | 'services'> & { 
  status?: BookingStatus;
  services?: string[];
};
