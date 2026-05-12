import { adminRepository } from '@/repositories/admin.repository';
import { RegisterInput, LoginInput } from '@/lib/validators/auth.validator';
import { generateToken, verifyToken } from '@/lib/jwt';

export class AdminService {
  async register(data: RegisterInput) {
    const existingAdmin = await adminRepository.findByEmail(data.email);
    if (existingAdmin) {
      throw new Error('Admin with this email already exists');
    }

    const newAdmin = await adminRepository.create(data);


    // Strip password from the returned object
    const adminObj = newAdmin.toObject();
    delete adminObj.password;
    
    return adminObj;
  }

  async login(data: LoginInput) {
    console.log('🔑 Login attempt for:', data.email);
    const admin = await adminRepository.findByEmail(data.email);
    
    if (!admin) {
      console.log('❌ Admin not found in database');
      throw new Error('Invalid credentials');
    }

    console.log('✅ Admin found, comparing passwords...');
    // Use the model method for comparison
    const isMatch = await (admin as any).comparePassword(data.password);
    
    if (!isMatch) {
      console.log('❌ Password does not match');
      console.log('DEBUG: Stored hash length:', admin.password?.length);
      throw new Error('Invalid credentials');
    }


    console.log('🎉 Password matches! Generating token...');


    const token = await generateToken({
      id: admin._id.toString(),
      email: admin.email,
      role: admin.role,
      name: admin.name,
    });

    return { token, admin: { id: admin._id.toString(), email: admin.email, name: admin.name, role: admin.role } };
  }

  async getMe(token: string) {
    if (!token) return null;
    
    const decoded: any = await verifyToken(token);
    if (!decoded || !decoded.id) return null;

    const admin = await adminRepository.findById(decoded.id);
    if (!admin) return null;

    return { 
      id: admin._id.toString(), 
      email: admin.email, 
      name: admin.name, 
      role: admin.role,
      phoneNumber: (admin as any).phoneNumber 
    };
  }

  async updateProfile(id: string, data: { name?: string, email?: string, phoneNumber?: string }) {
    const updatedAdmin = await adminRepository.updateById(id, data);
    if (!updatedAdmin) throw new Error('Admin not found');
    
    return {
      id: updatedAdmin._id.toString(),
      email: updatedAdmin.email,
      name: updatedAdmin.name,
      role: updatedAdmin.role,
      phoneNumber: (updatedAdmin as any).phoneNumber
    };
  }

  async changePassword(id: string, data: { currentPassword: string, newPassword: string }) {
    const admin = await adminRepository.findByIdWithPassword(id);
    if (!admin) throw new Error('Admin not found');

    const isMatch = await (admin as any).comparePassword(data.currentPassword);
    if (!isMatch) throw new Error('Incorrect current password');

    admin.password = data.newPassword;
    await admin.save();
    
    return { message: 'Password changed successfully' };
  }
}

export const adminService = new AdminService();
