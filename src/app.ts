import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import authRouter from './modules/auth/presentation/auth.router.js';
import tenantRouter from './modules/tenants/presentation/tenant.router.js';
import { errorHandler } from './common/middlewares/errorHandler.js';

const app = express();

// Security
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 }));

// Logging
app.use(morgan('combined'));

// Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/tenants', tenantRouter);

// Error handler — must be last
app.use(errorHandler);

export default app;
