import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { IAuthRepository } from '../domain/IAuthRepository.js';
import type { LoginDto, LoginResponseDto } from './auth.dto.js';
import type { ISuperAdminPublic } from '../domain/superAdmin.types.js';
import { UnauthorizedError } from '../../../common/errors/index.js';

const ACCESS_TOKEN_TTL  = 60 * 60;       // 1 hour
const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60; // 7 days

export class LoginUseCase {
  constructor(private readonly repo: IAuthRepository) {}

  async execute(dto: LoginDto): Promise<LoginResponseDto> {
    const admin = await this.repo.findByEmail(dto.email);
    if (!admin || !admin.isActive) throw new UnauthorizedError('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, admin.passwordHash);
    if (!valid) throw new UnauthorizedError('Invalid credentials');

    await this.repo.updateLastLogin(admin._id);

    const secret = process.env.JWT_SECRET!;

    const accessToken = jwt.sign(
      { sub: admin._id, role: admin.role },
      secret,
      { expiresIn: ACCESS_TOKEN_TTL },
    );

    const refreshToken = jwt.sign(
      { sub: admin._id, role: admin.role, type: 'refresh' },
      secret,
      { expiresIn: REFRESH_TOKEN_TTL },
    );

    const publicAdmin: ISuperAdminPublic = {
      _id:         admin._id,
      name:        admin.name,
      email:       admin.email,
      role:        admin.role,
      isActive:    admin.isActive,
      lastLoginAt: admin.lastLoginAt,
    };

    return {
      admin:  publicAdmin,
      tokens: { accessToken, refreshToken, expiresIn: ACCESS_TOKEN_TTL },
    };
  }
}
