import api from './api';
import { ReviewInput } from '@/lib/validators/review.validator';

export const reviewApi = {
  // Public
  getApprovedReviews: async () => {
    const response = await api.get('/reviews');
    return response.data.reviews;
  },
  submitReview: async (data: ReviewInput) => {
    const response = await api.post('/reviews', data);
    return response.data;
  },

  // Admin
  getAllReviews: async () => {
    const response = await api.get('/admin/reviews');
    return response.data.reviews;
  },
  approveReview: async (id: string) => {
    const response = await api.patch(`/admin/reviews/${id}`);
    return response.data;
  },
  deleteReview: async (id: string) => {
    const response = await api.delete(`/admin/reviews/${id}`);
    return response.data;
  },
};
