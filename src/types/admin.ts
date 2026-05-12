export interface IAdmin {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'superadmin';
  phoneNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}
