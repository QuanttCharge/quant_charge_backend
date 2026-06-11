// ─── Enums ────────────────────────────────────────────────────────────────────

export enum TenantStatus {
  ACTIVE    = 'active',
  SUSPENDED = 'suspended',
  INACTIVE  = 'inactive',
  PENDING   = 'pending',
}

export enum TenantType {
  CPO                 = 'cpo',
  FLEET_OPERATOR      = 'fleet_operator',
  ENTERPRISE          = 'enterprise',
  PROPERTY_OWNER      = 'property_owner',
  EV_SERVICE_PROVIDER = 'ev_service_provider',
}

export enum SubscriptionPlan {
  FREE         = 'free',
  STARTER      = 'starter',
  PROFESSIONAL = 'professional',
  ENTERPRISE   = 'enterprise',
}

export enum SubscriptionStatus {
  ACTIVE    = 'active',
  EXPIRED   = 'expired',
  CANCELLED = 'cancelled',
  TRIAL     = 'trial',
}

export enum BillingCycle {
  MONTHLY  = 'monthly',
  ANNUALLY = 'annually',
}

// ─── Sub-document Interfaces ──────────────────────────────────────────────────

export interface IAddress {
  line1:      string;
  line2?:     string;
  city:       string;
  state:      string;
  postalCode: string;
  country:    string;
}

export interface IContactInfo {
  email:    string;
  phone?:   string;
  website?: string;
}

export interface ISubscription {
  plan:                    SubscriptionPlan;
  status:                  SubscriptionStatus;
  billingCycle:            BillingCycle;
  trialEndsAt?:            Date;
  currentPeriodStart?:     Date;
  currentPeriodEnd?:       Date;
  externalSubscriptionId?: string;
  maxChargers:             number;
  maxSites:                number;
  maxUsers:                number;
}

export interface ITenantSettings {
  timezone:              string;
  currency:              string;
  locale:                string;
  publicChargingEnabled: boolean;
  autoInvoicing:         boolean;
  logoUrl?:              string;
  brandColor?:           string;
}

export interface ISuspensionInfo {
  suspendedAt: Date;
  reason:      string;
  suspendedBy: string;
}

// ─── Root Tenant Interface ────────────────────────────────────────────────────

export interface ITenant {
  slug:                   string;
  name:                   string;
  legalName?:             string;
  taxId?:                 string;
  type:                   TenantType;
  status:                 TenantStatus;
  suspensionInfo?:        ISuspensionInfo;
  contact:                IContactInfo;
  address?:               IAddress;
  subscription:           ISubscription;
  settings:               ITenantSettings;
  onboardingComplete:     boolean;
  onboardingCompletedAt?: Date;
  isDeleted:              boolean;
  deletedAt?:             Date;
  deletedBy?:             string;
  createdAt:              Date;
  updatedAt:              Date;
}
