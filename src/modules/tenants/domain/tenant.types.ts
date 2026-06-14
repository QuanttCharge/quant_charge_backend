export enum TenantStatus {
  ACTIVE    = 'active',
  SUSPENDED = 'suspended',
  INACTIVE  = 'inactive',
  PENDING   = 'pending',
}

export interface ITenant {
  _id:                  string;  // UUID v4
  name:                 string;
  chargerRange:         number;  // in kW
  subscriptionExpiry:   Date;
  numberOfSubscriptions: number;
  numberOfEmployees:    number;
  status:               TenantStatus;
  createdBy:            string;  // super admin userId
  createdAt:            Date;
  updatedAt:            Date;
}
