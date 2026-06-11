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

  logger.error('Unhandled error', { error: err });
  res.status(500).json({ success: false, message: 'Internal Server Error' });
};
