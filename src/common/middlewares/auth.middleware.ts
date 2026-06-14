import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError, ForbiddenError } from '../errors/index.js';
import type { UserRole } from '../../modules/users/domain/user.types.js';
import logger from '../utils/logger.js';

export interface AuthPayload {
  sub:       string;
  role:      UserRole;
  tenantId?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    logger.warn('[Auth] Missing token', { method: req.method, url: req.originalUrl, ip: req.ip });
    return next(new UnauthorizedError('Missing token'));
  }

  try {
    const token   = header.slice(7);
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;
    req.user      = payload;
    next();
  } catch {
    logger.warn('[Auth] Invalid or expired token', { method: req.method, url: req.originalUrl, ip: req.ip });
    next(new UnauthorizedError('Invalid or expired token'));
  }
};

export const authorize = (...roles: UserRole[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      logger.warn('[Auth] Insufficient permissions', { userId: req.user?.sub, role: req.user?.role, required: roles, url: req.originalUrl });
      return next(new ForbiddenError('Insufficient permissions'));
    }
    next();
  };
