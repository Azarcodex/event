import Admin from '@/models/Admin';
import { RegisterInput } from '@/lib/validators/auth.validator';

export class AdminRepository {
  /**
   * Find an admin by email
   */
  async findByEmail(email: string) {
    // Explicitly select the password as it is omitted by default in the schema
    return await Admin.findOne({ email }).select('+password').exec();
  }

  /**
   * Find an admin by ID
   */
  async findById(id: string) {
    return await Admin.findById(id).exec();
  }

  async findByIdWithPassword(id: string) {
    return await Admin.findById(id).select('+password').exec();
  }

  async updateById(id: string, data: any) {
    return await Admin.findByIdAndUpdate(id, data, { new: true, runValidators: true }).exec();
  }

  /**
   * Create a new admin
   */
  async create(data: RegisterInput) {
    const newAdmin = new Admin(data);
    return await newAdmin.save();
  }
}

export const adminRepository = new AdminRepository();
