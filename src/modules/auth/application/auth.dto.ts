import type { IUserPublic, UserRole } from '../../users/domain/user.types.js';

export interface LoginDto {
  email:    string;
  password: string;
}

export interface AuthTokenDto {
  accessToken:  string;
  refreshToken: string;
  expiresIn:    number;
}

export interface LoginResponseDto {
  user:   IUserPublic;
  tokens: AuthTokenDto;
}

export interface SeedSuperAdminDto {
  name:     string;
  email:    string;
  password: string;
}

export interface CreateUserDto {
  name:      string;
  email:     string;
  role:      UserRole;
  tenantId?: string;  // required for super_admin, ignored for tenant_admin
}
