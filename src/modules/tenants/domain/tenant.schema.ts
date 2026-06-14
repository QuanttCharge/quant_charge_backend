import { Schema, model, Document, Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { type ITenant, TenantStatus } from './tenant.types.js';

export interface ITenantDocument extends Omit<ITenant, '_id'>, Document<string> {
  _id: string;
}

export interface ITenantModel extends Model<ITenantDocument> {}

const TenantSchema = new Schema<ITenantDocument, ITenantModel>(
  {
    _id:                   { type: String, default: uuidv4 },
    name:                  { type: String, required: true, trim: true, index: true },
    chargerRange:          { type: Number, required: true },
    subscriptionExpiry:    { type: Date,   required: true },
    numberOfSubscriptions: { type: Number, required: true },
    numberOfEmployees:     { type: Number, required: true },
    status:                { type: String, enum: Object.values(TenantStatus), default: TenantStatus.ACTIVE, index: true },
    createdBy:             { type: String, required: true },
  },
  { collection: 'tenants', timestamps: true },
);

export const TenantModel = model<ITenantDocument, ITenantModel>('Tenant', TenantSchema);
