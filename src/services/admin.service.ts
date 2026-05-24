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

    if (admin.status === 'inactive') {
      console.log('❌ Account is inactive');
      throw new Error('Account is inactive. Please contact Super Admin.');
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
      permissions: admin.permissions || [],
      status: admin.status || 'active',
    });

    return { 
      token, 
      admin: { 
        id: admin._id.toString(), 
        email: admin.email, 
        name: admin.name, 
        role: admin.role,
        permissions: admin.permissions || [],
        status: admin.status || 'active'
      } 
    };
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
      permissions: admin.permissions || [],
      status: admin.status || 'active',
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
      permissions: updatedAdmin.permissions || [],
      status: updatedAdmin.status || 'active',
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

  async getAllAdmins() {
    const admins = await adminRepository.findAll();
    return admins.map((admin: any) => ({
      id: admin._id.toString(),
      email: admin.email,
      name: admin.name,
      role: admin.role,
      permissions: admin.permissions || [],
      status: admin.status || 'active',
      createdAt: admin.createdAt,
      phoneNumber: admin.phoneNumber,
    }));
  }

  async createAdmin(data: any) {
    const existingAdmin = await adminRepository.findByEmail(data.email);
    if (existingAdmin) {
      throw new Error('Admin with this email already exists');
    }

    const newAdmin = await adminRepository.create({
      ...data,
      role: 'admin', // Force regular admin role when created through dashboard
    });

    const adminObj = newAdmin.toObject();
    delete adminObj.password;
    return adminObj;
  }

  async updateAdmin(id: string, data: any) {
    const admin = await adminRepository.findByIdWithPassword(id);
    if (!admin) throw new Error('Admin not found');

    if (data.name !== undefined) admin.name = data.name;
    if (data.email !== undefined) admin.email = data.email;
    if (data.permissions !== undefined) admin.permissions = data.permissions;
    if (data.status !== undefined) admin.status = data.status;
    if (data.phoneNumber !== undefined) admin.phoneNumber = data.phoneNumber;
    
    if (data.password && data.password.trim() !== '') {
      admin.password = data.password;
    }

    await admin.save();
    
    const adminObj = admin.toObject();
    delete adminObj.password;
    return {
      id: adminObj._id.toString(),
      email: adminObj.email,
      name: adminObj.name,
      role: adminObj.role,
      permissions: adminObj.permissions || [],
      status: adminObj.status || 'active',
      phoneNumber: adminObj.phoneNumber
    };
  }

  async deleteAdmin(id: string) {
    const admin = await adminRepository.findById(id);
    if (!admin) throw new Error('Admin not found');
    
    if (admin.role === 'superadmin') {
      throw new Error('Cannot delete a Super Admin');
    }

    await adminRepository.deleteById(id);
    return { message: 'Admin deleted successfully' };
  }
}

export const adminService = new AdminService();
