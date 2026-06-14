import type { ITenant } from './tenant.types.js';

export interface ITenantRepository {
  create(data: Omit<ITenant, '_id' | 'createdAt' | 'updatedAt'>): Promise<ITenant>;
  findById(id: string):                                            Promise<ITenant | null>;
  findAll():                                                       Promise<ITenant[]>;
}
