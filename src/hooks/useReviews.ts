import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewApi } from '@/services/reviewApi';
import { ReviewInput } from '@/lib/validators/review.validator';
import { toast } from 'sonner';

export const useReviews = () => {
  return useQuery({
    queryKey: ['reviews', 'approved'],
    queryFn: reviewApi.getApprovedReviews,
  });
};

export const useAdminReviews = () => {
  return useQuery({
    queryKey: ['reviews', 'admin'],
    queryFn: reviewApi.getAllReviews,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ReviewInput) => reviewApi.submitReview(data),
    onSuccess: () => {
      toast.success('Review submitted for approval!');
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to submit review';
      toast.error(message);
    },
  });
};

export const useApproveReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reviewApi.approveReview(id),
    onSuccess: () => {
      toast.success('Review approved!');
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to approve review');
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reviewApi.deleteReview(id),
    onSuccess: () => {
      toast.success('Review deleted!');
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete review');
    },
  });
};
