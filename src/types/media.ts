export type MediaType = 'IMAGE' | 'VIDEO';

export interface IMedia {
  _id: string;
  eventId: string;
  publicId: string;
  secureUrl: string;
  mediaType: MediaType;
  format: string;
  size: number;
  width?: number;
  height?: number;
  duration?: number;
  thumbnailUrl?: string;
  title?: string;
  isHeroBanner: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedMedia {
  media: IMedia[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

export interface UploadProgress {
  fileName: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  result?: IMedia;
}
