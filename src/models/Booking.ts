import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBookingDocument extends Document {
  groomName: string;
  brideName: string;
  contactNumber: string;
  whatsappNumber: string;
  preferredFunctionDate: Date;
  functionStartTime: string;
  functionEndTime: string;
  functionLocation: string;
  venue: string;
  weddingTradition: string;
  programSchedule: string;
  functionType: string;
  additionalFunctions: string[];
  functionDays: string;
  functionPlannedAt: string;
  ritualsOrTraditions?: string;
  specialSuggestions?: string;
  expectedGuests: number;
  estimatedBudget: number;
  preferredCommunicationMethod: string;
  status: 'Pending' | 'Completed';
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBookingDocument>(
  {
    groomName: { type: String, required: true, trim: true },
    brideName: { type: String, required: true, trim: true },
    contactNumber: { type: String, required: true, trim: true },
    whatsappNumber: { type: String, required: true, trim: true },
    preferredFunctionDate: { type: Date, required: true },
    functionStartTime: { type: String, required: true },
    functionEndTime: { type: String, required: true },
    functionLocation: { type: String, required: true, trim: true },
    venue: { type: String, required: true, trim: true },
    weddingTradition: {
      type: String,
      required: true,
      enum: ['Muslim Wedding', 'Hindu Wedding', 'Christian Wedding', 'Other Tradition'],
    },
    programSchedule: {
      type: String,
      required: true,
      enum: ['Day', 'Night'],
    },
    functionType: {
      type: String,
      required: true,
      enum: ['Nikkah', 'Wedding', 'Reception'],
    },
    additionalFunctions: [{ type: String }],
    functionDays: {
      type: String,
      required: true,
      enum: ['1', '2', '3', 'Other'],
    },
    functionPlannedAt: {
      type: String,
      required: true,
      enum: ['Outdoor', 'Indoor'],
    },
    ritualsOrTraditions: { type: String, trim: true },
    specialSuggestions: { type: String, trim: true },
    expectedGuests: { type: Number, required: true },
    estimatedBudget: { type: Number, required: true },
    preferredCommunicationMethod: {
      type: String,
      required: true,
      enum: ['Phone Call', 'WhatsApp', 'Email', 'Botim', 'Google Meet', 'Zoom'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Completed'],
      default: 'Pending',
      required: true
    },
  },
  { timestamps: true }
);

const Booking: Model<IBookingDocument> =
  mongoose.models.Booking || mongoose.model<IBookingDocument>('Booking', BookingSchema);

export default Booking;
