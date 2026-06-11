import { Schema, model, Document, Model } from 'mongoose';
import type { ISuperAdmin } from '../domain/superAdmin.types.js';
import { SuperAdminRole } from '../domain/superAdmin.types.js';

export interface ISuperAdminDocument extends Omit<ISuperAdmin, '_id'>, Document { }

export interface ISuperAdminModel extends Model<ISuperAdminDocument> { }

const SuperAdminSchema = new Schema<ISuperAdminDocument, ISuperAdminModel>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: Object.values(SuperAdminRole), default: SuperAdminRole.SUPER_ADMIN },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
  },
  { collection: 'super_admins', timestamps: true },
);

export const SuperAdminModel = model<ISuperAdminDocument, ISuperAdminModel>('SuperAdmin', SuperAdminSchema);
