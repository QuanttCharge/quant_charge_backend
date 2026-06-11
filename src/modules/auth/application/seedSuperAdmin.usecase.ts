import bcrypt from 'bcryptjs';
import type { IAuthRepository } from '../domain/IAuthRepository.js';
import type { SeedSuperAdminDto } from './auth.dto.js';
import { SuperAdminRole } from '../domain/superAdmin.types.js';
import { logger } from '../../../common/utils/index.js';

export class SeedSuperAdminUseCase {
  constructor(private readonly repo: IAuthRepository) {}

  async execute(dto: SeedSuperAdminDto): Promise<void> {
    const alreadyExists = await this.repo.exists();
    if (alreadyExists) {
      logger.info('[Seed] Super admin already exists — skipping');
      return;
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    await this.repo.create({
      name:         dto.name,
      email:        dto.email,
      passwordHash,
      role:         SuperAdminRole.SUPER_ADMIN,
      isActive:     true,
    });

    logger.info(`[Seed] Super admin created: ${dto.email}`);
  }
}
