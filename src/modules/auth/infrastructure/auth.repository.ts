import type { IAuthRepository } from '../domain/IAuthRepository.js';
import type { ISuperAdmin } from '../domain/superAdmin.types.js';
import { SuperAdminModel } from './superAdmin.model.js';

const toPlain = (doc: any): ISuperAdmin => ({
  _id:          doc._id.toString(),
  name:         doc.name,
  email:        doc.email,
  passwordHash: doc.passwordHash,
  role:         doc.role,
  isActive:     doc.isActive,
  lastLoginAt:  doc.lastLoginAt,
  createdAt:    doc.createdAt,
  updatedAt:    doc.updatedAt,
});

export class AuthRepository implements IAuthRepository {
  async findByEmail(email: string): Promise<ISuperAdmin | null> {
    const doc = await SuperAdminModel.findOne({ email: email.toLowerCase() });
    return doc ? toPlain(doc) : null;
  }

  async findById(id: string): Promise<ISuperAdmin | null> {
    const doc = await SuperAdminModel.findById(id);
    return doc ? toPlain(doc) : null;
  }

  async create(data: Omit<ISuperAdmin, '_id' | 'createdAt' | 'updatedAt'>): Promise<ISuperAdmin> {
    const doc = await SuperAdminModel.create(data);
    return toPlain(doc);
  }

  async updateLastLogin(id: string): Promise<void> {
    await SuperAdminModel.findByIdAndUpdate(id, { lastLoginAt: new Date() });
  }

  async exists(): Promise<boolean> {
    const count = await SuperAdminModel.countDocuments();
    return count > 0;
  }
}
