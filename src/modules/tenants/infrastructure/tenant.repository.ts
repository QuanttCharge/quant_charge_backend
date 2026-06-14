import type { ITenantRepository } from '../domain/ITenantRepository.js';
import type { ITenant } from '../domain/tenant.types.js';
import { TenantModel } from '../domain/tenant.schema.js';

const toPlain = (doc: any): ITenant => ({
  _id:                   doc._id,
  name:                  doc.name,
  chargerRange:          doc.chargerRange,
  subscriptionExpiry:    doc.subscriptionExpiry,
  numberOfSubscriptions: doc.numberOfSubscriptions,
  numberOfEmployees:     doc.numberOfEmployees,
  status:                doc.status,
  createdBy:             doc.createdBy,
  createdAt:             doc.createdAt,
  updatedAt:             doc.updatedAt,
});

export class TenantRepository implements ITenantRepository {
  async create(data: Omit<ITenant, '_id' | 'createdAt' | 'updatedAt'>): Promise<ITenant> {
    const doc = await TenantModel.create(data);
    return toPlain(doc);
  }

  async findById(id: string): Promise<ITenant | null> {
    const doc = await TenantModel.findById(id);
    return doc ? toPlain(doc) : null;
  }

  async findAll(): Promise<ITenant[]> {
    const docs = await TenantModel.find().sort({ createdAt: -1 });
    return docs.map(toPlain);
  }
}
