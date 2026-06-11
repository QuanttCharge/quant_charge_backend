import 'dotenv/config';
import app from './app.js';
import { connectDB } from './database/index.js';
import { SeedSuperAdminUseCase } from './modules/auth/application/seedSuperAdmin.usecase.js';
import { AuthRepository } from './modules/auth/infrastructure/auth.repository.js';
import { logger } from './common/utils/index.js';

const PORT = process.env.PORT ?? 5000;

const bootstrap = async (): Promise<void> => {
  await connectDB();

  // Seed super admin from env vars if not exists
  await new SeedSuperAdminUseCase(new AuthRepository()).execute({
    name:     process.env.SUPER_ADMIN_NAME     ?? 'Super Admin',
    email:    process.env.SUPER_ADMIN_EMAIL    ?? 'admin@quantcharge.com',
    password: process.env.SUPER_ADMIN_PASSWORD ?? 'changeme123',
  });

  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT} [${process.env.NODE_ENV}]`);
  });
};

bootstrap().catch((err) => {
  logger.error('Failed to start server', { error: err });
  process.exit(1);
});
