import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEventDocument extends Document {
  name: string;
  description?: string;
  date?: Date;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEventDocument>(
  {
    name: {
      type: String,
      required: [true, 'Event name is required'],
      trim: true,
      maxlength: [200, 'Event name cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    date: {
      type: Date,
    },
    location: {
      type: String,
      trim: true,
      maxlength: [500, 'Location cannot exceed 500 characters'],
    },
  },
  { timestamps: true }
);

const Event: Model<IEventDocument> =
  mongoose.models.Event || mongoose.model<IEventDocument>('Event', EventSchema);

export default Event;
