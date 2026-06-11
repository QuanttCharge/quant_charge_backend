import { Schema, model, Document, Model } from 'mongoose';
import { type IUser, UserRole, UserStatus } from './user.types.js';

export interface IUserDocument extends Omit<IUser, '_id'>, Document {}
export interface IUserModel extends Model<IUserDocument> {}

const UserSchema = new Schema<IUserDocument, IUserModel>(
  {
    name:         { type: String, required: true, trim: true },
    email:        { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
    passwordHash: { type: String, required: true },
    role:         { type: String, enum: Object.values(UserRole),   required: true, index: true },
    status:       { type: String, enum: Object.values(UserStatus), default: UserStatus.ACTIVE, index: true },
    tenantId:     { type: String, index: true },
    lastLoginAt:  { type: Date },
  },
  { collection: 'users', timestamps: true },
);

UserSchema.index({ role: 1, status: 1 });
UserSchema.index({ tenantId: 1, role: 1 });

export const UserModel = model<IUserDocument, IUserModel>('User', UserSchema);
