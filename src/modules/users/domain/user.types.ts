export enum UserRole {
  SUPER_ADMIN     = 'super_admin',
  TENANT_ADMIN    = 'tenant_admin',
  OPERATOR        = 'operator',
  DRIVER          = 'driver',
  SUPPORT         = 'support',
}

export enum UserStatus {
  ACTIVE    = 'active',
  INACTIVE  = 'inactive',
  SUSPENDED = 'suspended',
}

export interface IUser {
  _id:                  string;
  name:                 string;
  email:                string;
  passwordHash:         string;
  role:                 UserRole;
  status:               UserStatus;
  tenantId?:            string;
  isPasswordSet:        boolean;
  setupToken?:          string;
  setupTokenExpiresAt?: Date;
  lastLoginAt?:         Date;
  createdAt:            Date;
  updatedAt:            Date;
}

export interface IUserPublic {
  _id:          string;
  name:         string;
  email:        string;
  role:         UserRole;
  status:       UserStatus;
  tenantId?:    string;
  lastLoginAt?: Date;
}
