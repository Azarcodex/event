import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ISharedDocument extends Document {
  title: string;
  publicId: string;
  secureUrl: string;
  isEnabled: boolean;
  uploadedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SharedDocumentSchema = new Schema<ISharedDocument>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
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
    isEnabled: {
      type: Boolean,
      default: true,
      index: true,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'AdminUser',
      required: true,
    },
  },
  { timestamps: true }
);

const SharedDocument: Model<ISharedDocument> =
  mongoose.models.SharedDocument ||
  mongoose.model<ISharedDocument>('SharedDocument', SharedDocumentSchema);

export default SharedDocument;
