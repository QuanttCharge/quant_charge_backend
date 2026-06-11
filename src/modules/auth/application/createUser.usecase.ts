import bcrypt from 'bcryptjs';
import type { IAuthRepository } from '../domain/IAuthRepository.js';
import type { CreateUserDto } from './auth.dto.js';
import type { IUserPublic } from '../../users/domain/user.types.js';
import { UserStatus } from '../../users/domain/user.types.js';
import { ConflictError } from '../../../common/errors/index.js';

export class CreateUserUseCase {
  constructor(private readonly repo: IAuthRepository) {}

  async execute(dto: CreateUserDto): Promise<IUserPublic> {
    const existing = await this.repo.findByEmail(dto.email);
    if (existing) throw new ConflictError('Email already in use');

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.repo.create({
      name:         dto.name,
      email:        dto.email,
      passwordHash,
      role:         dto.role,
      status:       UserStatus.ACTIVE,
      tenantId:     dto.tenantId,
    });

    return {
      _id:      user._id,
      name:     user.name,
      email:    user.email,
      role:     user.role,
      status:   user.status,
      tenantId: user.tenantId,
    };
  }
}
