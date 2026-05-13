import Review, { IReview } from '@/models/Review';

export class ReviewRepository {
  async create(data: Partial<IReview>) {
    const newReview = new Review(data);
    return await newReview.save();
  }

  async findAll() {
    return await Review.find().sort({ createdAt: -1 }).exec();
  }

  async findApproved() {
    return await Review.find({ isApproved: true }).sort({ createdAt: -1 }).exec();
  }

  async findById(id: string) {
    return await Review.findById(id).exec();
  }

  async updateById(id: string, data: Partial<IReview>) {
    return await Review.findByIdAndUpdate(id, data, { new: true, runValidators: true }).exec();
  }

  async deleteById(id: string) {
    return await Review.findByIdAndDelete(id).exec();
  }
}

export const reviewRepository = new ReviewRepository();
