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
  admin:  import('../domain/superAdmin.types.js').ISuperAdminPublic;
  tokens: AuthTokenDto;
}

export interface SeedSuperAdminDto {
  name:     string;
  email:    string;
  password: string;
}
