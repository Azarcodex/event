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
  status: 'Pending' | 'Completed';
  createdAt: string;
  updatedAt: string;
}

export type BookingInput = Omit<IBooking, '_id' | 'createdAt' | 'updatedAt' | 'status'> & { status?: 'Pending' | 'Completed' };
