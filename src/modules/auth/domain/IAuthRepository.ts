import type { ISuperAdmin } from './superAdmin.types.js';

export interface IAuthRepository {
  findByEmail(email: string):          Promise<ISuperAdmin | null>;
  findById(id: string):                Promise<ISuperAdmin | null>;
  create(data: Omit<ISuperAdmin, '_id' | 'createdAt' | 'updatedAt'>): Promise<ISuperAdmin>;
  updateLastLogin(id: string):         Promise<void>;
  exists():                            Promise<boolean>;
}
