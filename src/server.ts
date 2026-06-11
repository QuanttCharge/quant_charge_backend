import 'dotenv/config';
import app from './app.js';
import { connectDB } from './database/index.js';
import { logger } from './common/utils/index.js';

const PORT = process.env.PORT ?? 5000;

const bootstrap = async (): Promise<void> => {
  await connectDB();

  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT} [${process.env.NODE_ENV}]`);
  });
};

bootstrap().catch((err) => {
  logger.error('Failed to start server', { error: err });
  process.exit(1);
});
