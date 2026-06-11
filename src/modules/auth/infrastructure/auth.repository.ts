import type { IAuthRepository } from '../domain/IAuthRepository.js';
import type { IUser } from '../../users/domain/user.types.js';
import { UserRole } from '../../users/domain/user.types.js';
import { UserModel } from '../../users/domain/user.schema.js';

const toPlain = (doc: any): IUser => ({
  _id:          doc._id.toString(),
  name:         doc.name,
  email:        doc.email,
  passwordHash: doc.passwordHash,
  role:         doc.role,
  status:       doc.status,
  tenantId:     doc.tenantId,
  lastLoginAt:  doc.lastLoginAt,
  createdAt:    doc.createdAt,
  updatedAt:    doc.updatedAt,
});

export class AuthRepository implements IAuthRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    const doc = await UserModel.findOne({ email: email.toLowerCase() });
    return doc ? toPlain(doc) : null;
  }

  async findById(id: string): Promise<IUser | null> {
    const doc = await UserModel.findById(id);
    return doc ? toPlain(doc) : null;
  }

  async create(data: Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>): Promise<IUser> {
    const doc = await UserModel.create(data);
    return toPlain(doc);
  }

  async updateLastLogin(id: string): Promise<void> {
    await UserModel.findByIdAndUpdate(id, { lastLoginAt: new Date() });
  }
}
