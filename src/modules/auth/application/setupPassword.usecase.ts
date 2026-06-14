import bcrypt from 'bcryptjs';
import type { IAuthRepository } from '../domain/IAuthRepository.js';
import { BadRequestError } from '../../../common/errors/index.js';
import { logger } from '../../../common/utils/index.js';

export interface SetupPasswordDto {
  token:    string;
  password: string;
}

export class SetupPasswordUseCase {
  constructor(private readonly repo: IAuthRepository) {}

  async execute(dto: SetupPasswordDto): Promise<void> {
    const user = await this.repo.findBySetupToken(dto.token);

    if (!user || !user.setupTokenExpiresAt) {
      logger.warn('[SetupPassword] Invalid token used');
      throw new BadRequestError('Invalid or expired setup link');
    }
    if (user.setupTokenExpiresAt < new Date()) {
      logger.warn('[SetupPassword] Expired token used', { userId: user._id, email: user.email, expiredAt: user.setupTokenExpiresAt });
      throw new BadRequestError('Setup link has expired');
    }
    if (user.isPasswordSet) {
      logger.warn('[SetupPassword] Token already used', { userId: user._id, email: user.email });
      throw new BadRequestError('Password already set');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    await this.repo.setPassword(user._id, passwordHash);
    logger.info('[SetupPassword] Password set successfully', { userId: user._id, email: user.email, role: user.role });
  }
}
