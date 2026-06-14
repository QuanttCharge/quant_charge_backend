import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError.js';
import logger from '../utils/logger.js';

export const errorHandler = (err: unknown, req: Request, res: Response, _next: NextFunction): void => {
  const meta = { method: req.method, url: req.originalUrl, ip: req.ip };

  if (err instanceof AppError) {
    // Log 5xx operational errors as error, 4xx as warn
    if (err.statusCode >= 500) {
      logger.error('[Error] Server error', { ...meta, message: err.message, stack: err.stack });
    } else {
      logger.warn('[Error] Client error', { ...meta, status: err.statusCode, message: err.message });
    }

    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.details ? { details: err.details } : {}),
    });
    return;
  }

  // Truly unexpected errors
  logger.error('[Error] Unhandled exception', { ...meta, error: (err as Error)?.message, stack: (err as Error)?.stack });
  res.status(500).json({ success: false, message: 'Internal Server Error' });
};
