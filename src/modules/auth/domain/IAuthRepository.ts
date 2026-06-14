import type { IUser } from '../../users/domain/user.types.js';

export interface IAuthRepository {
  findByEmail(email: string):                                     Promise<IUser | null>;
  findById(id: string):                                           Promise<IUser | null>;
  create(data: Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>):  Promise<IUser>;
  updateLastLogin(id: string):                                    Promise<void>;
  findBySetupToken(token: string):                                Promise<IUser | null>;
  setPassword(id: string, passwordHash: string):                  Promise<void>;
}
