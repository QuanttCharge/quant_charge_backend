import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { IAuthRepository } from '../domain/IAuthRepository.js';
import type { LoginDto, LoginResponseDto } from './auth.dto.js';
import type { IUserPublic } from '../../users/domain/user.types.js';
import { UserStatus } from '../../users/domain/user.types.js';
import { UnauthorizedError } from '../../../common/errors/index.js';

const ACCESS_TOKEN_TTL  = 60 * 60;
const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60;

export class LoginUseCase {
  constructor(private readonly repo: IAuthRepository) {}

  async execute(dto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.repo.findByEmail(dto.email);
    if (!user || user.status !== UserStatus.ACTIVE) throw new UnauthorizedError('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedError('Invalid credentials');

    await this.repo.updateLastLogin(user._id);

    const secret = process.env.JWT_SECRET!;

    const accessToken  = jwt.sign({ sub: user._id, role: user.role }, secret, { expiresIn: ACCESS_TOKEN_TTL });
    const refreshToken = jwt.sign({ sub: user._id, role: user.role, type: 'refresh' }, secret, { expiresIn: REFRESH_TOKEN_TTL });

    const publicUser: IUserPublic = {
      _id:         user._id,
      name:        user.name,
      email:       user.email,
      role:        user.role,
      status:      user.status,
      tenantId:    user.tenantId,
      lastLoginAt: user.lastLoginAt,
    };

    return { user: publicUser, tokens: { accessToken, refreshToken, expiresIn: ACCESS_TOKEN_TTL } };
  }
}
