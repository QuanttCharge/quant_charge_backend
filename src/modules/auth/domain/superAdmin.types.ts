export enum SuperAdminRole {
  SUPER_ADMIN = 'super_admin',
}

export interface ISuperAdmin {
  _id:           string;
  name:          string;
  email:         string;
  passwordHash:  string;
  role:          SuperAdminRole;
  isActive:      boolean;
  lastLoginAt?:  Date;
  createdAt:     Date;
  updatedAt:     Date;
}

export interface ISuperAdminPublic {
  _id:          string;
  name:         string;
  email:        string;
  role:         SuperAdminRole;
  isActive:     boolean;
  lastLoginAt?: Date;
}
