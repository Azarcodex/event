import { reviewRepository } from '@/repositories/review.repository';
import { IReview } from '@/models/Review';

export class ReviewService {
  async submitReview(data: Partial<IReview>) {
    return await reviewRepository.create({
      ...data,
      isApproved: false,
    });
  }

  async getApprovedReviews() {
    return await reviewRepository.findApproved();
  }

  async getAllReviews() {
    return await reviewRepository.findAll();
  }

  async approveReview(id: string) {
    const review = await reviewRepository.updateById(id, { isApproved: true });
    if (!review) throw new Error('Review not found');
    return review;
  }

  async deleteReview(id: string) {
    const review = await reviewRepository.deleteById(id);
    if (!review) throw new Error('Review not found');
    return review;
  }
}

export const reviewService = new ReviewService();
