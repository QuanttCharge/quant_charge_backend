import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError.js';
import logger from '../utils/logger.js';

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.details ? { details: err.details } : {}),
    });
    return;
  }

  const message = err instanceof Error ? err.message : String(err);
  const stack = err instanceof Error ? err.stack : undefined;
  logger.error(`Unhandled error: ${message}`, { stack });
  res.status(500).json({ success: false, message: 'Internal Server Error' });
};
