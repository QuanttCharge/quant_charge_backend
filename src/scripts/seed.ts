import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from '../database/index.js';
import { UserModel } from '../modules/users/domain/user.schema.js';
import { UserRole, UserStatus } from '../modules/users/domain/user.types.js';
import { logger } from '../common/utils/index.js';

const requireEnv = (key: string): string => {
  const value = process.env[key]?.trim();
  if (!value) throw new Error(`${key} must be set in .env`);
  return value;
};

const seed = async (): Promise<void> => {
  await connectDB();

  const email        = requireEnv('SUPER_ADMIN_EMAIL');
  const name         = requireEnv('SUPER_ADMIN_NAME');
  const passwordHash = await bcrypt.hash(requireEnv('SUPER_ADMIN_PASSWORD'), 12);

  const result = await UserModel.findOneAndUpdate(
    { role: UserRole.SUPER_ADMIN },
    {
      $set: {
        name,
        email,
        passwordHash,
        role:          UserRole.SUPER_ADMIN,
        status:        UserStatus.ACTIVE,
        isPasswordSet: true,
      },
    },
    { upsert: true, new: true },
  );

  logger.info('[Seed] Super admin upserted successfully', { email: result.email });
};

seed()
  .catch((err) => {
    logger.error('[Seed] Failed', { error: (err as Error).message });
    process.exit(1);
  })
  .finally(() => mongoose.disconnect());
