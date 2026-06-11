import { Schema, model, Document, Model, Query } from 'mongoose';
import type { ITenant } from './tenant.types.js';
import {
  TenantStatus,
  TenantType,
  SubscriptionPlan,
  SubscriptionStatus,
  BillingCycle,
} from './tenant.types.js';

// ─── Document Interface ───────────────────────────────────────────────────────

export interface ITenantDocument extends ITenant, Document {
  isActive():                                   boolean;
  isSuspended():                                boolean;
  suspend(reason: string, suspendedBy: string): void;
  reactivate():                                 void;
  softDelete(deletedBy: string):                void;
}

// ─── Model Interface ──────────────────────────────────────────────────────────

export interface ITenantModel extends Model<ITenantDocument> {
  findActive():              Query<ITenantDocument[], ITenantDocument>;
  findBySlug(slug: string):  Promise<ITenantDocument | null>;
}

// ─── Sub-schemas ──────────────────────────────────────────────────────────────

const AddressSchema = new Schema(
  {
    line1:      { type: String, trim: true },
    line2:      { type: String, trim: true },
    city:       { type: String, trim: true },
    state:      { type: String, trim: true },
    postalCode: { type: String, trim: true },
    country:    { type: String, trim: true },
  },
  { _id: false },
);

const ContactInfoSchema = new Schema(
  {
    email:   { type: String, required: true, trim: true, lowercase: true },
    phone:   { type: String, trim: true },
    website: { type: String, trim: true },
  },
  { _id: false },
);

const SubscriptionSchema = new Schema(
  {
    plan:                    { type: String, enum: Object.values(SubscriptionPlan),   default: SubscriptionPlan.FREE },
    status:                  { type: String, enum: Object.values(SubscriptionStatus), default: SubscriptionStatus.TRIAL },
    billingCycle:            { type: String, enum: Object.values(BillingCycle),       default: BillingCycle.MONTHLY },
    trialEndsAt:             { type: Date },
    currentPeriodStart:      { type: Date },
    currentPeriodEnd:        { type: Date },
    externalSubscriptionId:  { type: String, trim: true },
    maxChargers:             { type: Number, default: 0 },
    maxSites:                { type: Number, default: 0 },
    maxUsers:                { type: Number, default: 5 },
  },
  { _id: false },
);

const TenantSettingsSchema = new Schema(
  {
    timezone:              { type: String,  default: 'UTC' },
    currency:              { type: String,  default: 'INR' },
    locale:                { type: String,  default: 'en-IN' },
    publicChargingEnabled: { type: Boolean, default: false },
    autoInvoicing:         { type: Boolean, default: true },
    logoUrl:               { type: String,  trim: true },
    brandColor:            { type: String,  trim: true },
  },
  { _id: false },
);

const SuspensionInfoSchema = new Schema(
  {
    suspendedAt: { type: Date },
    reason:      { type: String, trim: true },
    suspendedBy: { type: String, trim: true },
  },
  { _id: false },
);

// ─── Root Tenant Schema ───────────────────────────────────────────────────────

const TenantSchema = new Schema<ITenantDocument, ITenantModel>(
  {
    slug: {
      type:      String,
      required:  true,
      unique:    true,
      trim:      true,
      lowercase: true,
      match:     /^[a-z0-9-]+$/,
      index:     true,
    },
    name:      { type: String, required: true, trim: true },
    legalName: { type: String, trim: true },
    taxId:     { type: String, trim: true },
    type:      { type: String, enum: Object.values(TenantType), required: true },
    status:    { type: String, enum: Object.values(TenantStatus), default: TenantStatus.PENDING, index: true },

    suspensionInfo: { type: SuspensionInfoSchema },
    contact:        { type: ContactInfoSchema, required: true },
    address:        { type: AddressSchema },
    subscription:   { type: SubscriptionSchema,    default: () => ({}) },
    settings:       { type: TenantSettingsSchema,  default: () => ({}) },

    onboardingComplete:    { type: Boolean, default: false },
    onboardingCompletedAt: { type: Date },

    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date },
    deletedBy: { type: String, trim: true },
  },
  { collection: 'tenants', timestamps: true, versionKey: '__v' },
);

// ─── Compound Indexes ─────────────────────────────────────────────────────────

TenantSchema.index({ status: 1, type: 1 });
TenantSchema.index({ 'subscription.currentPeriodEnd': 1 });
TenantSchema.index({ isDeleted: 1, status: 1 });

// ─── Statics ──────────────────────────────────────────────────────────────────

TenantSchema.statics.findActive = function (): Query<ITenantDocument[], ITenantDocument> {
  return this.find({ isDeleted: false });
};

TenantSchema.statics.findBySlug = function (slug: string): Promise<ITenantDocument | null> {
  return this.findOne({ slug, isDeleted: false }).exec();
};

// ─── Instance Methods ─────────────────────────────────────────────────────────

TenantSchema.methods.isActive = function (this: ITenantDocument): boolean {
  return this.status === TenantStatus.ACTIVE && !this.isDeleted;
};

TenantSchema.methods.isSuspended = function (this: ITenantDocument): boolean {
  return this.status === TenantStatus.SUSPENDED;
};

TenantSchema.methods.suspend = function (this: ITenantDocument, reason: string, suspendedBy: string): void {
  this.status = TenantStatus.SUSPENDED;
  this.suspensionInfo = { suspendedAt: new Date(), reason, suspendedBy };
};

TenantSchema.methods.reactivate = function (this: ITenantDocument): void {
  this.status         = TenantStatus.ACTIVE;
  this.suspensionInfo = undefined;
};

TenantSchema.methods.softDelete = function (this: ITenantDocument, deletedBy: string): void {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.deletedBy = deletedBy;
  this.status    = TenantStatus.INACTIVE;
};

// ─── Model ────────────────────────────────────────────────────────────────────

export const TenantModel = model<ITenantDocument, ITenantModel>('Tenant', TenantSchema);
