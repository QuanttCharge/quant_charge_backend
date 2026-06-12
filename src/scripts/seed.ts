import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../database/index.js';
import { CreateUserUseCase } from '../modules/auth/application/createUser.usecase.js';
import { AuthRepository } from '../modules/auth/infrastructure/auth.repository.js';
import { UserRole } from '../modules/users/domain/user.types.js';
import { logger } from '../common/utils/index.js';

const requireEnv = (key: string): string => {
  const value = process.env[key]?.trim();
  if (!value) {
    throw new Error(`${key} must be set in .env`);
  }
  return value;
};

const seed = async (): Promise<void> => {
  await connectDB();

  const repo = new AuthRepository();
  const email = requireEnv('SUPER_ADMIN_EMAIL');
  const existing = await repo.findByEmail(email);

  if (existing) {
    logger.info('[Seed] Super admin already exists — skipping');
  } else {
    await new CreateUserUseCase(repo).execute({
      name:     requireEnv('SUPER_ADMIN_NAME'),
      email,
      password: requireEnv('SUPER_ADMIN_PASSWORD'),
      role:     UserRole.SUPER_ADMIN,
    });
    logger.info(`[Seed] Super admin created: ${email}`);
  }

  await mongoose.disconnect();
  logger.info('[Seed] Done');
};

seed().catch((err) => {
  logger.error('[Seed] Failed', { error: err });
  process.exit(1);
});
