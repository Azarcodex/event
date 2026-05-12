import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export type MediaType = 'IMAGE' | 'VIDEO';

export interface IMediaDocument extends Document {
  eventId?: Types.ObjectId;
  publicId: string;
  secureUrl: string;
  mediaType: MediaType;
  format: string;
  size: number;
  width?: number;
  height?: number;
  duration?: number;
  thumbnailUrl?: string;
  isHeroBanner: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema = new Schema<IMediaDocument>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: false,
      index: true,
    },
    publicId: {
      type: String,
      required: [true, 'Cloudinary public ID is required'],
      unique: true,
    },
    secureUrl: {
      type: String,
      required: [true, 'Secure URL is required'],
    },
    mediaType: {
      type: String,
      enum: ['IMAGE', 'VIDEO'],
      required: [true, 'Media type is required'],
    },
    format: {
      type: String,
      required: [true, 'Format is required'],
    },
    size: {
      type: Number,
      required: [true, 'File size is required'],
    },
    width: {
      type: Number,
    },
    height: {
      type: Number,
    },
    duration: {
      type: Number, // seconds, videos only
    },
    thumbnailUrl: {
      type: String, // video thumbnail URL
    },
    isHeroBanner: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Compound index for efficient event-based queries
MediaSchema.index({ eventId: 1, createdAt: -1 });

const Media: Model<IMediaDocument> =
  mongoose.models.Media || mongoose.model<IMediaDocument>('Media', MediaSchema);

export default Media;
